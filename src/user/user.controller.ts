/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards } from "@nestjs/common";
import { User } from "generated/prisma";
import { GetUser } from "../../src/decorator";
import { JwtGuard } from "../../src/guard";
import { PrismaService } from "../../src/prisma/prisma.service";

@UseGuards(JwtGuard)
@Controller("users")
export class UserController {
  constructor(private prisma: PrismaService){}
  @Get("me")
  getMe(@GetUser() user: User) {
    //return the user from the payload
    return user;
  }


}
