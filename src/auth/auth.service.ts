import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto): Promise<{ access_token: string; refresh_token: string }> {
    if(!dto.username || !dto.password || !dto.institutional_email) {
      throw new BadRequestException("username, institutional_email and password are required");
    }
    
    const hash = await argon.hash(dto.password);
    
    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          institutional_email: dto.institutional_email,
          hash,
          role: dto.role || 'STUDENT',
        },
      });

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


  private async generateTokens(userId: number, username: string, email: string, role: string) {
    const accessPayload = { sub: userId, email, role, username };
    const refreshPayload = { sub: userId };

    console.log(process.env.JWT_REFRESH_SECRET);

    const accessToken = await this.jwt.signAsync(accessPayload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = await this.jwt.signAsync(refreshPayload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    console.log({
      access_token: accessToken,
      refresh_token: refreshToken,
    })


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
      const secret =  process.env.JWT_REFRESH_SECRET;
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
