/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from "class-validator";

export class createBookmarkDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  link!: string;
}