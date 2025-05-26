/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from "class-validator";

export class createBookmarkDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  link?: string;
}