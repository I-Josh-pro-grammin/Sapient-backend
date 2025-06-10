/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateCourseDto } from "./dto";
import { CoursesService } from "./courses.service";

@Controller('courses')
export class CoursesController{
  constructor (private course: CoursesService) {}
  
  @Post()
  createCourse(@Body() dto: CreateCourseDto ) {
    return this.course.createCourse(dto)
  }

  @Get('/:id')
  getCourseById() {
    return this.getCourseById()
  }
}