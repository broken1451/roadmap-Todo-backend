import { IsEmail, IsString, Matches, MaxLength, MinLength, IsOptional } from 'class-validator';


export class LoginDto {


    @IsString()
    @IsEmail()
    @IsOptional()
    email: string

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;

}