import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    name: string;


    @IsString()
    @IsEmail()
    @IsOptional()
    email: string

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;

    @IsString({ each: true }) // cada uno de los elementos  del arreglo  tiene q ser string
    @IsArray()
    @IsOptional()
    roles?: string[];

}
