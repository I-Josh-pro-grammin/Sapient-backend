import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class EditUserDto {
  @ApiProperty({
    description: "The first name of the user",
    example: "John Doe",
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: "The email of the user",
    example: "john.doe@example.com",
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
