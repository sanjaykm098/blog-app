import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CheckAuthMiddleware implements NestMiddleware {
  private jwtService: JwtService;
  private userService: UserService;

  constructor(jwtService: JwtService, userService: UserService) {
    this.jwtService = jwtService;
    this.userService = userService;
  }

  async use(req: any, res: any, next: () => void) {
    const headers = req.headers;
    if (!headers.authorization) {
      res.status(401).send({
        message: 'You are not authorized to access this resource',
        error: 'Authorization header is missing',
        statusCode: 401,
      });
      return;
    }

    const bearer = headers.authorization.split(' ')[0];
    const token = headers.authorization.split(' ')[1];
    if (bearer !== 'Bearer') {
      res.status(401).send({
        message: 'You are not authorized to access this resource',
        error: 'Bearer token is missing',
        statusCode: 401,
      });
      return;
    }

    if (!token) {
      res.status(401).send({
        message: 'You are not authorized to access this resource',
        error: 'Token is missing',
        statusCode: 401,
      });
      return;
    }
    // console.log('token', token);
    try {
      const decoded = await this.jwtService.verify(token);
      if (!decoded) {
        res.status(401).send({
          message: 'You are not authorized to access this resource',
          error: 'Invalid token',
          statusCode: 401,
        });
        return;
      }
      // check if the user is in the database
      const user = await this.userService.findUserById(decoded.user._id);
      if (!user) {
        res.status(401).send({
          message: 'You are not authorized to access this resource',
          error: 'User not found',
          statusCode: 401,
        });
        return;
      }
      next();
    } catch (error) {
      res.status(401).send({
        message: 'You are not authorized to access this resource',
        error: 'Invalid token ' + error,
        statusCode: 401,
      });
    }
  }
}
