import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    try {
      //Create hashed password with argon
      const hash = await argon.hash(dto.password);
      //Save the new user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      //returning the user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("User already exists");
        }
      }
      throw error;
    }
  }

  async login(dto: AuthDto) {
    //Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        hash: true,
      },
    });

    if (!user) {
      throw new ForbiddenException("Incorrect credentials");
    }

    const { hash, ...userWithoutHash } = user;
    //Compare passwords
    const pwMatches = await argon.verify(hash, dto.password);
    //Throw error if not matching
    if (!pwMatches) {
      throw new ForbiddenException("Incorrect password");
    }

    return userWithoutHash;
  }
}
