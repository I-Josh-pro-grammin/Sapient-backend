/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
  @ApiProperty({
    description: "User email",
    name: "izere@gmail.com",
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: "User password",
    name: "izere12",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
