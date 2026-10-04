import {
  ValidationPipe,
} from "@nestjs/common";

import {
  NestFactory,
} from "@nestjs/core";

import cookieParser from "cookie-parser";

import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app =
    await NestFactory.create(
      AppModule
    );

  /*
   * Cookie parser
   */
  app.use(cookieParser());

  /*
   * Allow frontend
   */
  app.enableCors({
    origin:
      "http://localhost:3000",

    credentials: true,
  });

  /*
   * DTO validation
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  /*
   * Backend runs on 3001
   */
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();