import { Module } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { TodolistController } from './todolist.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Todolist, TodoShema } from './entities/todolist.entity';

@Module({
  controllers: [TodolistController],
  providers: [TodolistService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Todolist.name, schema: TodoShema, collection:'todo-list' }])
  ]
})
export class TodolistModule {}
