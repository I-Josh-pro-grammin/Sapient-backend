import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import { Response } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { retry } from "rxjs";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  //Signup Controller
  @Post("signup")
  async signup(@Res() res, @Body() dto: AuthDto) {
    const { access_token, refresh_token } = await this.authService.signup(dto);

    (res as any).cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    (res as any).status(201).json({
      message: "Signup successful"
    })
  }

  @Get('verify-email')
  async verify(@Query('token') token: string) {
    return await this.authService.verifyUser(token);
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) res) {
    try {
      res.clearCookie("refresh_token");
    return { message: "Logged out successfully" };
    } catch (error) {
      res.status(500).json({
        error: "Logout failed"
      })
    }
  }

}
