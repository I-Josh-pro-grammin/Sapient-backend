import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  //Signup Controller
  @Post("signup")
  signup(
    @Body()
    dto: AuthDto,
  ) {
    return this.authService.signup(dto);
  }

  // //Login Controller
  // @Post("login")
  // login(
  //   @Body()
  //   dto: LoginDto,
  // ) {
  //   return this.authService.login(dto);
  // }

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
