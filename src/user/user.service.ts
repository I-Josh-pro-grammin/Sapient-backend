/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EditUserDto, } from "./dto";
import { GetUser } from "src/decorator";
import { User } from "generated/prisma";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
  getMe(@GetUser() user: User){
        //return the user from the payload

        return {
          id: user.id,
          email: user.email
        }; // Return only plain values;
  }

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        image: dto.image,
        email: dto.email,
        username: dto.username,
      },
    });

    return {
      id: user.id,
      image: user.image,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt

  }
}

  async getUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

}
