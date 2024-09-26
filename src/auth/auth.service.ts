import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './entities/auth.entity';
import { isValidObjectId, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtInterface } from './interface/jwt.interface';
import { rolesPermited } from './utils/roles-permited';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  private readonly rolesPermited: string[] = [
    'ADMIN',
    'USER',
    'SUPERVISOR',
  ];


  constructor(
    @InjectModel(Auth.name) private readonly userModel: Model<Auth>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) { }

  async create(createAuthDto: CreateAuthDto) {

    let { name, email, password, ...restProperties } = createAuthDto;
    name = name.toLowerCase().trim();
    email = email?.toLowerCase().trim();


    let userExist: Auth;

    if (email) {
      userExist = await this.userModel.findOne({ email });
      if (userExist) {
        throw new BadRequestException(
          `El Usuario Existe en la db  con el correo ${userExist.email}`,
        );
      }
    }



    const saltOrRounds = 10;
    password = bcrypt.hashSync(password, saltOrRounds);
    let userCreated = await this.userModel.create({
      name,
      email,
      password,
      ...restProperties
    });

    return { userCreated, token: this.getJWT({ id: userCreated._id.toString() }) };
  }

  async findAll() {
    const users = await this.userModel
      .find({})
      // .skip(Number(desde))
      .limit(5)
      .sort({ created: 1 });
    const countsUser = await this.userModel.countDocuments({});
    return { users, countsUser };
  }

  async findOne(id: string) {

    if (!isValidObjectId(id)) {
      throw new BadRequestException(`${id} no es a valid mongo id`);
    }
    const userDb = await this.userModel.findOne({
      _id: id
    })
    // .select('name email roles isActive');

    if (!userDb) {
      throw new BadRequestException(`El usuario con el id ${id} no existe`);
    }

    return userDb;

  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {

    await this.findOne(id);

    if (updateAuthDto.roles) {
      let rolesPermit = rolesPermited(updateAuthDto.roles, this.rolesPermited);
      updateAuthDto.roles = rolesPermit;
    }

    updateAuthDto.updated = Date.now();
    if (updateAuthDto.password) {
      const saltOrRounds = 10;
      updateAuthDto.password = bcrypt.hashSync(updateAuthDto.password, saltOrRounds);
    }
    const userUpdate = await this.userModel.findByIdAndUpdate(
      id,
      { update_at: Date.now(), ...updateAuthDto },
      {
        new: true,
      },
    );

    if (!userUpdate) {
      throw new BadRequestException(`El usuario con el id ${id} no existe`);
    }
    return userUpdate;

  }

  async updatePassword(updateAuthDto: UpdateAuthDto) {
    const { email, password } = updateAuthDto;
    updateAuthDto.updated = Date.now();
    const saltOrRounds = 10;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException(`El usuario con el email ${email} no existe`);
      
    }
    user.update_at = Date.now();
    user.password = bcrypt.hashSync(password, saltOrRounds);
    user.retry = 0;
    await user.save();
    return user;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException(`El usuario con el id ${id} no existe`);
    }
    user.isActive = false;
    const userUpdate = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    return userUpdate;
  }

  private getJWT(payload: JwtInterface): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async login(loginDto: LoginDto) {
    const { password, email } = loginDto;
    const logger = new Logger('Login user');

    let user: Auth;

    if (email) {
      user = await this.userModel.findOne({ email });
    }

    if (!user) {
      throw new UnauthorizedException(`Credenciales incorrectas`);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      if (user.retry == 3) {
        throw new UnauthorizedException(`Usuario Bloqueado`);
      }

      user.retry = user.retry + 1;

      await this.userModel.findByIdAndUpdate(user._id, user, {
        new: true,
      });

      throw new UnauthorizedException(`Credenciales incorrectas`);
    }

    if (user.retry == 3) {
      throw new UnauthorizedException(`Usuario Bloqueado`);
    }

    user.retry = 0;
    await this.userModel.findByIdAndUpdate(user._id, user, {
      new: true,
    });
    logger.log(`Login user`);
    return {
      ok: true,
      user,
      token: this.getJWT({ id: user._id.toString() }),
    };
  }


  async checkToken(id: string): Promise<any> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new BadRequestException(`El Usuario con el id ${id} no existe`);
    }
    return {
      user,
      token: this.getJWT({ id: user._id.toString() })
    };
  }

}
