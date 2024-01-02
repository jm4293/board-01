import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  PASSWORD_SALT = 10;
  constructor(private readonly userService: UserService) {}

  @Get('/login')
  login(@Req() loginUser: { query: LoginUserDto }) {
    return this.userService.login(loginUser.query);
  }

  @Post('/create')
  async createUser(@Body() input: CreateUserDto) {
    return this.userService.createUser(input);
  }
}
