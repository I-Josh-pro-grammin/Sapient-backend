import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { LoginDto } from "./dto/login.dto";

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

  //Login Controller
  @Post("login")
  login(
    @Body()
    dto: LoginDto,
  ) {
    return this.authService.login(dto);
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) res) {
    res.clearCookie?.("refresh_token");
    return { message: "Logged out successfully" };
  }

}
