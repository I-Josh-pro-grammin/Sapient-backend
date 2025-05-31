/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Get, Param, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { User } from "generated/prisma";
import { GetUser } from "src/decorator";
import { JwtGuard } from "src/guard";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("users")
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @UseGuards(JwtGuard)
  @Get("profile")
  getMe(@GetUser() user: User) {
    return  this.userService.getMe(user);
  }

  @Put('/edit/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpg'
        ) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only JPEG and PNG images are allowed'), false);
        }
      },
    }),
  )
  async updateUser(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: EditUserDto,
  ) {
    console.log('Uploaded File:', file); // 👈 ADD THIS
    const imagePath = file ? `/uploads/profile-images/${file.filename}` : undefined;
    console.log('Image Path:', imagePath); // 👈 You said this is undefined
    return this.userService.editUser(+id, { ...dto, image: imagePath });
  }
  
}
