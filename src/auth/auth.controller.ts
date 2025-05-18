import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //Signup Controller
  @Post('signup')
  signup(@Body() dto: any) {
    console.log({
      dto,
    });
    return this.authService.signup();
  }

  //Login Controller
  @Post('login')
  login() {
    return this.authService.login();
  }
}
