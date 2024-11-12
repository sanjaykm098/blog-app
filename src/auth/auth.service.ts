import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(createAuthDto: CreateAuthDto) {
    const user = await this.userService.verifyLogin(createAuthDto);
    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }
    const token = await this.generateToken(user);
    return token;
  }

  async checkLogin(request) {
    // get authenticated user using the token from the request header
    // get all the headers from the request
    const headers = request.headers;
    // get the authorization header
    const authorization = headers.authorization;
    // get the token from the authorization header
    const token = authorization.split(' ')[1];

    if (!token) {
      throw new HttpException('Token is missing', 401);
    }

    const decoded = await this.verifyToken(token);
    if (!decoded) {
      throw new HttpException('Invalid token', 401);
    }

    return this.userService.findUserById(decoded.user._id, ['name', 'email']);
  }

  async generateToken(user: object) {
    const payload = { user };
    // set expiry to 1 day
    const token = await this.jwtService.sign(payload);
    const data = {
      token,
      statusCode: 200,
      user,
      message: 'Login successful',
    };
    return data;
  }

  async verifyToken(token: string) {
    try {
      const decoded = await this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new HttpException('Invalid token ' + error, 401);
    }
  }
}
