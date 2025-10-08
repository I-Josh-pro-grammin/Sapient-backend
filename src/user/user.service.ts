import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EditUserDto, } from "./dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
//   getMe(@GetUser() user: User){
//         return {
//           id: user.id,
//           email: user.email
//         }; // Return only plain values;
//   }

//   async editUser(userId: number, dto: EditUserDto) {
//     const user = await this.prisma.user.update({
//       where: {
//         id: userId,
//       },
//       data: {
//         institutional_email: dto.email,
//         username: dto.username,
//       },
//     });

//     return {
//       institutional_email: user.institutional_email,
//       username: user.username,
//       role: user.role,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt

//   }
// }

//   async getUsers() {
//     const users = await this.prisma.user.findMany();
//     return users;
//   }

}
