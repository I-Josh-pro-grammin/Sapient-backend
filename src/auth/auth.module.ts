import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";
import { MailerService } from './mailer/mailer.service';

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailerService],
})
export class AuthModule {}
