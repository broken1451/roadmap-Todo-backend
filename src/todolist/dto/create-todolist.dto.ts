import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";


export class CreateTodolistDto {

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    title: string;


    @IsString()
    @IsOptional()
    description: string

    @IsBoolean()
    @IsOptional()
    completed: boolean
}
