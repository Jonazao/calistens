import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { UserService } from './user.service';

import { CreateUserDto } from './dtos/create-user.dto';
import { ApiParam } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the user',
    example: '64b7d5f9fc13ae4567000001', // Example ObjectId format
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
