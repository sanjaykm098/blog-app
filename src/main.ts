import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  (hbs as any).registerPartials(join(__dirname, '..', 'views/partials'));
  (hbs as any).registerPartials(join(__dirname, '..', 'views/layout'));
  app.setViewEngine('hbs');
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
