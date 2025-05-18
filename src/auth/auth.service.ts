import { Injectable, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  @Post('signup')
  signup() {
    return 'signed up successfully';
  }

  @Post('login')
  login() {
    return 'logged in successfully';
  }
}
