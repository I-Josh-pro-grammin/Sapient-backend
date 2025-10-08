import {
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ApiBadRequestResponse, ApiResponse } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
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

  @ApiResponse({
    description: 'User created successfully as required'
  })
  @ApiBadRequestResponse({
    description: 'User could not register. Try again'
  })
  async signup(dto: AuthDto) {
    try {
      //Create hashed password with argon
      const hash = await argon.hash(dto.password);

      //Generate verification token
      const verificationToken = generateVerificationToken()

      //Save the new user in db
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          institutional_email: dto.institutional_email,
          hash,
          role: dto.role,
          verificationToken
        },
      });

      await this.mailerService.sendVerificationEmail('blessedwinner66@gmail.com', verificationToken)

      //returning the user token
      return this.signToken(user.id, user.institutional_email, user.role);
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === "P2002") {
          throw new ForbiddenException(
            "User already exists",
          );
        }
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
      access_token: token,
    };
  }

  
}
