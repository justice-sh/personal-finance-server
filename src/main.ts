import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
  });

  app.use(cookieParser());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
    prefix: "api/v",
  });

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
