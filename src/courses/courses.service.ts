/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCourseDto } from "./dto";

@Injectable()
export class CoursesService{
  constructor (private prisma: PrismaService){}

  createCourse(dto: CreateCourseDto) {
    const course = this.prisma.course.create({
      data: dto
    });

    return  course
  }

  getCourseById() {
    return 
  }
}