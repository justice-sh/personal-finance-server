import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { VersioningType } from "@nestjs/common";
import { ConfigService } from "./config/config.service";
import { GlobalErrorFilter } from "./shared/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: new ConfigService().get((env) => env.VALID_ORIGINS),
    credentials: true,
  });

  app.use(cookieParser());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1", // TODO: use environment variable for production
    prefix: "api/v",
  });

  app.useGlobalFilters(new GlobalErrorFilter());

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
