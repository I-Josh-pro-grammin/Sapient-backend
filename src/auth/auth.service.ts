import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signup() {
    return 'signed up successfully';
  }

  login() {
    return 'logged in successfully';
  }
}
