import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const serverConfig = config.get('server');

  const app: NestApplication = await NestFactory.create(AppModule);
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);

  logger.log(`Application is running on: ${port}`);
}
bootstrap();