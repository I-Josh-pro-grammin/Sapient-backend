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

import { retry } from "rxjs";

import { LoginDto } from "./dto/login.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";


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
  async verify(@Query('token') token: string, @Res() res: Response) {
    try {
      await this.authService.verifyUser(token);
      // Render success template
      res.render('verification-success', { 
        message: 'Email verified successfully! You can now log in.',
        title: 'Verification Successful'
      });
    } catch (error) {
      // Render failure template
      const errorMessage = error instanceof Error ? error.message : 'Verification failed. The token may be invalid or expired.';
      res.render('verification-failed', { 
        message: errorMessage,
        title: 'Verification Failed'
      });
    }

  // //Login Controller
  
  @Post("login")
  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 403, description: "Incorrect credentials" })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
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
