import { IsEmail, IsString } from "class-validator";

export class UserLoginDto {
  @IsEmail({}, { message: "Email not valid" })
  email: string;
  @IsString()
  password: string;
}
