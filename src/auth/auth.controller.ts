/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
// import { Throttle } from "@nestjs/throttler";

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
  //Using throttle to limit the number of logins
  // @Throttle(5, 60)
  //loging in
  @Post("login")
  login(
    @Body()
    dto: AuthDto,
  ) {
    return this.authService.login(dto);
  }
}
