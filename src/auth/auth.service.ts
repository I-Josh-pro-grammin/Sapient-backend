import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { MailerService } from "./mailer/mailer.service";
import { generateVerificationToken } from "../utils/verify";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private readonly mailerService: MailerService
  ) {}

  async signup(dto: AuthDto): Promise<{ access_token: string; refresh_token: string }> {
    if(!dto.username || !dto.password || !dto.institutional_email) {
      throw new BadRequestException("username, institutional_email and password are required");
    }

    if(dto.role === "SUPERADMIN") {
      throw new BadRequestException("You cannot create another super admin")
    }
    
    const hash = await argon.hash(dto.password);
    const verificationToken = generateVerificationToken()
    const tokenExpiration = new Date(Date.now() + 30 * 60 * 1000);
    
    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          institutional_email: dto.institutional_email,
          hash,
          role: dto.role || 'STUDENT',
          verificationToken,
          tokenExpiration
        },
      });

      await this.mailerService.sendVerificationEmail(dto.institutional_email,verificationToken)

      if (!user) {
        throw new InternalServerErrorException("Signup failed");
      }

      return await this.generateTokens(
        user.id,
        user.username,
        user.institutional_email,
        user.role ?? 'STUDENT',
      );
    } catch (error) {
      console.log(error)
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ForbiddenException("User already exists");
      }
      throw error;
    }
  }


  //User verification
  async verifyUser(token: string) {
    if (!token) {
      throw new BadRequestException("Verification token is required");
    }

    const now = new Date();
    
    const existingUser = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (existingUser && existingUser.isVerified) {
      throw new BadRequestException("Account already verified.");
    }

    // Check if token is expired
    if (existingUser && existingUser.tokenExpiration && existingUser.tokenExpiration < now) {
      throw new BadRequestException("Verification token has expired.");
    }

    // Update user to verified
    const updateResult = await this.prisma.user.updateMany({
      where: {
        verificationToken: token,
        isVerified: false,
        OR: [
          { tokenExpiration: null },
          { tokenExpiration: { gte: now } },
        ],
      },
      data: {
        isVerified: true,
        verificationToken: null,
        tokenExpiration: null,
      },
    });

    if (updateResult.count === 0) {
      throw new BadRequestException("Invalid or expired verification token.");
    }

    return { message: "Email verified successfully" };
  }


  private async generateTokens(userId: number, username: string, email: string, role: string) {
    const accessPayload = { sub: userId, email, role, username };
    const refreshPayload = { sub: userId };

    // Access token uses secret configured in JwtModule.registerAsync
    const accessToken = await this.jwt.signAsync(accessPayload, {
      expiresIn: '15m',
    });

    // Refresh token uses a separate secret from env/config
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');
    if (!refreshSecret) {
      throw new InternalServerErrorException('JWT_REFRESH_SECRET is not defined');
    }
    const refreshToken = await this.jwt.signAsync(refreshPayload, {
      expiresIn: '7d',
      secret: refreshSecret,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(refreshToken: string | undefined): Promise<{ access_token: string; refresh_token: string; user: { id: number; email: string; role: string | null} }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    try {
      const secret =  this.config.get<string>('JWT_REFRESH_SECRET');
      const payload = await this.jwt.verifyAsync(refreshToken, { secret }) as any;

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          username: true,
          institutional_email: true,
          role: true,
        },
      });

      if (!user) throw new UnauthorizedException('Invalid refresh token - user not found');

        const { access_token, refresh_token } = await this.generateTokens(user.id, user.username, user.institutional_email, user.role ?? 'USER');
        console.log( access_token, refresh_token );
        return { access_token: access_token, refresh_token: refresh_token, user: { id: user.id, email: user.institutional_email, role: user.role ?? "USER"} }
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');

  async login(dto: LoginDto) {

    const user = await this.prisma.user.findFirst({
      where: {
        username: dto.username,
        institutional_email: dto.institutional_email
      },
    });

    if (!user) {
      throw new ForbiddenException("Incorrect credentials");
    }

    
    const pwMatches = await argon.verify(user.hash, dto.password);

    if (!pwMatches) {
      throw new ForbiddenException("Incorrect password");
    }
    return this.generateTokens(user.id, user.username, user.institutional_email, user.role ?? 'USER');
  }




  async signToken(
    userId: number,
    email: string,
    role: string,
  ): Promise<{
    access_token: string;
  }> {
    const payload = {
      sub: userId,
      email,
      role: role
    };

    const secret = this.config.get("JWT_SECRET");

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: "1day",
        secret: secret,
      },
    );

    return {
      access_token: token,
    };
  }


  
}
