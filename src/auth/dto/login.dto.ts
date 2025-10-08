import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export  class LoginDto {
  @IsNotEmpty()
  username!: string  

  @IsNotEmpty()
  @IsEmail()
  institutional_email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}