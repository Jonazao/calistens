import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { hash } from 'argon2';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './enums/roles.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashedPassword = await hash(password);
    const newUser = new User();
    newUser.email = user.email;
    newUser.name = user.name;
    newUser.password = hashedPassword;
    newUser.role = Role.TRAINEE;
    return this.userRepository.save(newUser);
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({
      where: {
        _id: new ObjectId(id), // Convert string to ObjectId
      },
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async updateHashedRefreshToken(userId: ObjectId, hashedRT: string | null) {
    return await this.userRepository.update(userId, {
      hashedRefreshToken: hashedRT,
    });
  }
}
