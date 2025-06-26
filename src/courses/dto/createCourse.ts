/* eslint-disable prettier/prettier */
import { Level } from "@prisma/client";
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateCourseDto {
  
  @IsString()
  title!: string;
  
  @IsString()
  category!: string;
  
  @IsString()
  level!: Level;

  @IsString()
  @IsNotEmpty()
  description!: string;
  
  @IsNotEmpty()
  duration!: number;
  
  @IsOptional()
  studentsCount!: number;
}