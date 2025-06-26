/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCourseDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class CoursesService{
  constructor (private prisma: PrismaService){}

  async createCourse(dto: CreateCourseDto) {
    try {
      const course = await this.prisma.course.create({
        data: dto
      });
  
      console.log(course);
  
      return  course;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === "P2002") {
          throw new ForbiddenException(
            "Course already exists",
          );
        }
      }
      throw error;
    }
  }

  async getCourseById(courseId : number) {

  }

  async getCourse() {
    return await this.prisma.course.findMany();
  }
}