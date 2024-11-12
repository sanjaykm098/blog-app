import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/User.schema';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await argon2.hash(createUserDto.password);
    const emailExists = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (emailExists) {
      throw new HttpException('Email already exists', 422);
    }
    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();
    const data = {
      user: {
        email: createdUser.email,
        name: createdUser.name,
        id: createdUser._id,
      },
      statusCode: 201,
      message: 'User created successfully!',
    };

    return data;
  }

  async findAll() {
    // get all the user except the password
    const users = await this.userModel.find({}, { password: 0 });
    const data = {
      users,
      statusCode: 200,
      message: 'Users found',
    };

    return data;
  }

  async findOne(id: string) {
    const user = await this.findUserById(id);
    const data = {
      user,
      statusCode: 200,
      message: 'User found',
    };
    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let user = await this.findUserById(id);
    if (updateUserDto.email) {
      // check if the email exists skip the current user
      const emailExists = await this.userModel.findOne({
        email: updateUserDto.email,
        _id: { $ne: id },
      });
      if (emailExists) {
        throw new HttpException('Email already exists', 422);
      }
    }
    if (updateUserDto.password) {
      updateUserDto.password = await argon2.hash(updateUserDto.password);
    }
    await this.userModel.findByIdAndUpdate(id, updateUserDto);
    user = await this.findUserById(id, ['email', 'name']);
    const data = {
      statusCode: 200,
      user: user,
      message: 'User updated successfully',
    };
    return data;
  }

  async remove(id: string) {
    const user = await this.findUserById(id);
    await this.userModel.findByIdAndDelete(user._id);
    const data = {
      statusCode: 200,
      user: user,
      message: 'User deleted successfully',
    };
    return data;
  }

  // creating reusable function to find user by id and return the user also skip the column array
  async findUserById(id: string, columns: string[] = []) {
    const user = await this.userModel.findById(id, columns);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  async verifyLogin(createAuthDto: CreateAuthDto) {
    const user = await this.userModel.findOne({ email: createAuthDto.email });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const isPasswordMatch = await argon2.verify(
      user.password,
      createAuthDto.password,
    );
    if (!isPasswordMatch) {
      throw new HttpException('Invalid credentials', 401);
    }
    user.password = undefined;
    return user;
  }
}
