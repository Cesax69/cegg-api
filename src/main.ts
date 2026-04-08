import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
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

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

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