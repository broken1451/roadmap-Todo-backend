import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTodolistDto } from './dto/create-todolist.dto';
import { UpdateTodolistDto } from './dto/update-todolist.dto';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Todolist } from './entities/todolist.entity';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class TodolistService {


  constructor(
    @InjectModel(Todolist.name) private readonly todoModel: Model<Todolist>,
    private readonly configService: ConfigService
  ) { }

  
  async create(createTodolistDto: CreateTodolistDto, user?: any) {
    let { description, title , usuario} = createTodolistDto;
    description = description.toLowerCase().trim();
    title = title.toLowerCase().trim();
    usuario = user;

    let todoExist: Todolist;
    todoExist = await this.todoModel.findOne({ title });
    
    if (todoExist) {
      throw new BadRequestException(
        `The Todo already exist in the db with the title ${todoExist.title}`,
      );
    }

    let todoCreated = await this.todoModel.create({
      title,
      description,
      usuario,
    });

    return todoCreated;
  }

  async findAll(page: string = '0', limit:  string = '0', user?: any) {

    if (Number(page) == 1) {
      page = (Number(page) - 1).toString();
    }

    const todoList = await this.todoModel
      .find({
      usuario: user
      })
      .skip(Number(page))
      .limit(Number(limit))
      .sort({ created: 1 })
      .populate('usuario', '_id name email');
    const countsTodos = await this.todoModel.countDocuments({
      usuario: user
    });
    return { todoList, total: countsTodos, page: ( Number(page) == 0 ) ? 1 : Number(page), limit: Number(limit), todoListLength: todoList.length };
  }

 async findOne(id: string, user?: any) {
    
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} no es a valid mongo id`);
    }

    const todoDb = await this.todoModel.findOne({
      _id: id,
      usuario: user
    })
    // .select('name email roles isActive');

    if (!todoDb) {
      throw new BadRequestException(`The Todo with the id ${id} does not exist`);
    }

    return todoDb;
  }

  async update(id: string, updateTodolistDto: UpdateTodolistDto, user?: any) {
    await this.findOne(id);

    updateTodolistDto.updated = Date.now();
    const todoUpdate = await this.todoModel.findByIdAndUpdate(
      id,
      { update_at: Date.now(), usuario: user , ...updateTodolistDto },
      {
        new: true,
      },
    );

    if (!todoUpdate) {
      throw new BadRequestException(`El usuario con el id ${id} no existe`);
    }
    return todoUpdate;

  }

  async remove(id: string, user?: any) {
    const todo = await this.findOne(id);
    if (!todo) {
      throw new BadRequestException(`El usuario con el id ${id} no existe`);
    }
    const todoDeleted = await this.todoModel.deleteOne({
      _id: id,
      usuario: user
    });

    return todoDeleted;
  }


  async findTodoByTerm(term: string, desde: string = '0', user?: any) {
    let expRegular = new RegExp(term, 'i');
    const todolist = await this.todoModel
      .find({
        usuario: user,
        $or: [{ title: expRegular }, { description: expRegular }],
      },'')
      .skip(Number(desde))
      .limit(10)
      .sort({ created: 1 });

      const countsTodo = await this.todoModel.countDocuments({
        title: expRegular,
        description: expRegular,
      });

      return { todolist, todolistLength: todolist.length, countsTodo };
  }
}
