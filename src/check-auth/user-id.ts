import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const jwtService = new JwtService({
  secret: process.env.JWT_SECRET || 'secret',
});

export const GetUserId = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.split(' ')[1];
    let user;
    try {
      user = await jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token ' + error);
    }
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user.user._id;
  },
);
