import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    abortOnError: false,
  });
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
