import {
  BadRequestException,
  ForbiddenException,
  Injectable,
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

  async login(dto: LoginDto) {
    //Find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: {
          username: dto.username,
        },
      });

    if (!user) {
      throw new ForbiddenException(
        "Incorrect credentials",
      );
    }

    //Compare passwords
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    //Throw error if not matching
    if (!pwMatches) {
      throw new ForbiddenException(
        "Incorrect password",
      );
    }

    return this.signToken(user.id, user.institutional_email, user.role);
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
    }
  }


  
}
