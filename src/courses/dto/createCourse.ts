/* eslint-disable prettier/prettier */
import { Level } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator"

export class CreateCourseDto {
  
  @IsString()
  title!: string;
  
  @IsString()
  category!: string;
  
  @IsString()
  level!: Level;
  
  @IsNotEmpty()
  duration!: number;
  
  @IsNotEmpty()
  studentsCount!: number;
}