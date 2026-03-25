import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));


  //uso de filtros
  app.useGlobalFilters(new AllExceptionFilter())
  
  const config = new DocumentBuilder()
    .setTitle('API con vulnerabilidades de seguridad')
    .setDescription('Documentacion de la API para pruebas')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000', "Servidor de prueba")
    .addServer('https://www.cegg.com', "Servidor de produccion")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

//? POSTGRES
//! npm i pg
//! npm i @types/pg

//? MYSQL
//! npm i mysql2
//! npm i @types/mysql

//!npm i @nestjs/swagger