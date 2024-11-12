import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  create(@Body(ValidationPipe) createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Get('check')
  checkLogin(@Request() request) {
    return this.authService.checkLogin(request);
  }
}
