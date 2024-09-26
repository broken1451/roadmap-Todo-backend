import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './decorators/auth.decorator';
import { ValidRoles } from './interface/role.interfaces';
import { Auth as UserAuth } from './entities/auth.entity';
import { GetUser } from './decorators/user-decorator';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }




  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  // @Auth(ValidRoles.admin) 
  // findAll(@GetUser('') user: UserAuth) {
  findAll() {
    return this.authService.findAll()
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

  @Post('/login')
  login(@Body() loginAuthDto: LoginDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('/check-token/refresh')
  @Auth()
  checkToken(@Request() req?: Request) {
    const id = req['user'].id;
    return this.authService.checkToken(id);
  }

  @Patch('/update/password')
  updatePassword(@Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.updatePassword(updateAuthDto);
  }
}
