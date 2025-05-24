/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { User } from "generated/prisma";
import { GetUser } from "src/decorator";
import { JwtGuard } from "src/guard";
import { PrismaService } from "src/prisma/prisma.service";
import { EditUserDto } from "./dto";

@UseGuards(JwtGuard)
@Controller("users")
export class UserController {
  constructor(private prisma: PrismaService){}
  @Get("me")
  getMe(@GetUser() user: User) {
    //return the user from the payload
    return user;
  }

  @Patch('edit')
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.editUser(userId, dto);
  }

}
