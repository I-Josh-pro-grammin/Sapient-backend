import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //Signup Controller
  @Post('signup')
  signup() {
    return this.authService.signup();
  }

  //Login Controller
  @Post('login')
  login() {
    return this.authService.login();
  }
}
