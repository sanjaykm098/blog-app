import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { BlogModule } from './blog/blog.module';
import { FrontModule } from './front/front.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/nest-blog'),
    UserModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    BlogModule,
    FrontModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
