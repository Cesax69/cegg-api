import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import helmet from 'helmet';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.use(helmet());

    app.enableCors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

  const basicAuth = require('express-basic-auth');
  const authMiddleware = basicAuth({
    challenge: true,
    users: { admin: 'admin123' },
    unauthorizedResponse: 'Inicia sesión como administrador de la API para ver la especificación.'
  });

  app.use('/docs', authMiddleware);
  app.use('/docs-json', authMiddleware);

    app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true 
    }));

    const config = new DocumentBuilder()
      .setTitle('Nexus API')
      .setDescription('Nexus Enterprise Management System')
      .setVersion('1.0.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT ?? 3001);
  } catch (error) {
    console.error('Bootstrap failed:', error);
  }
}
bootstrap();