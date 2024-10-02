import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { CreateTodolistDto } from './dto/create-todolist.dto';
import { UpdateTodolistDto } from './dto/update-todolist.dto';
import { Auth } from '@decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interface/role.interfaces';
import { Throttle } from '@nestjs/throttler';

@Controller('todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}


  @Post()
  @Auth(ValidRoles.admin) 
  create(@Body() createTodolistDto: CreateTodolistDto, @Request() req: Request) {
    const user = req['user']._id;
    return this.todolistService.create(createTodolistDto, user);
  }

  @Get()
  @Auth(ValidRoles.admin) 
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  findAll( @Query('page') page: string, @Query('limit') limit: string, @Request() req: Request) {
    const user = req['user']._id;
    return this.todolistService.findAll(page, limit, user);
  }


  @Get('/:id')
  @Auth(ValidRoles.admin) 
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  findOne(@Param('id') id: string, @Request() req: Request) {
    const user = req['user']._id;
    return this.todolistService.findOne(id, user);
  }

  @Patch('/:id')
  @Auth(ValidRoles.admin) 
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  update(@Param('id') id: string, @Body() updateTodolistDto: UpdateTodolistDto, @Request() req: Request) {
    const user = req['user']._id;
    return this.todolistService.update(id, updateTodolistDto, user);
  }

  @Delete('/:id')
  @Auth(ValidRoles.admin) 
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  remove(@Param('id') id: string, @Request() req: Request) {
    const user = req['user']._id;
    return this.todolistService.remove(id, user);
  }

  @Get('/find-todo-by-term/:term')
  @Auth(ValidRoles.admin) 
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  findTodoByTerm(@Param('term') term: string,  @Query('desde') desde: string, @Request() req: Request) {
    const user = req['user']._id;
    return this.todolistService.findTodoByTerm(term, desde, user);
  }



}
