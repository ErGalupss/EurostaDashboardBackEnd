import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './src/app.module.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Global prefix for API
  app.setGlobalPrefix('api');
  
  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Enterprise Backend-Driven UI API')
    .setDescription('API for managing dynamic frontend configurations')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Serve static files from frontend/dist in production
  // In development, frontend is served by Vite dev server
  if (process.env.NODE_ENV === 'production') {
    const frontendDistPath = join(process.cwd(), 'frontend', 'dist');
    
    app.useStaticAssets(frontendDistPath);
    
    // SPA Fallback
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) {
        next();
      } else {
        res.sendFile(join(frontendDistPath, 'index.html'));
      }
    });
  }

  // Port 3000 is required by the platform
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch(err => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
