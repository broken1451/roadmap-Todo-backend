import { applyIsOptionalDecorator, PartialType } from '@nestjs/mapped-types';
import { CreateTodolistDto } from './create-todolist.dto';

import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateTodolistDto extends PartialType(CreateTodolistDto) {

    @IsOptional()
    @Type(() => Number)
    updated: number;
}
