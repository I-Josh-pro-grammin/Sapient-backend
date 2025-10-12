/* eslint-disable prettier/prettier */

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import { PrismaExceptionFilter } from "./Filters/prisma.exceptionfilter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.setBaseViewsDir(join(__dirname, 'auth/mailer/templates'));
    app.setViewEngine('ejs');
    app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalFilters( new PrismaExceptionFilter() )

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("Nest API")
    .setDescription("The Nest API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT ?? 8000);
}

void bootstrap();
