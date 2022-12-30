import { IsEmail, IsString } from "class-validator";

export class UserRegisterDto{
    @IsEmail({}, {message: "Email not valid"})
    email: string;
    @IsString()
    password: string;
    @IsString()
    name: string;   
}