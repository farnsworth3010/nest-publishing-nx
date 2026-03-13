import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PublishingApiGatewayModule } from './publishing-api-gateway.module';

@Catch()
class AllExceptionsFilter implements ExceptionFilter {
  catch( exception: unknown, host: ArgumentsHost ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    console.error( 'Exception caught:', exception );
    response.status( status ).json( {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error:
        exception instanceof HttpException
          ? exception.getResponse()
          : exception,
    } );
  }
}

async function bootstrap() {
  const app = await NestFactory.create( PublishingApiGatewayModule );

  app.useGlobalPipes( new ValidationPipe() );
  app.useGlobalFilters( new AllExceptionsFilter() );

  const config = new DocumentBuilder()
    .setTitle( 'Publishing' )
    .setDescription( 'Publishing API description' )
    .setVersion( '1.0' )
    .addTag( 'publishing' )
    .addBearerAuth( {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    }, 'bearer' )
    .build();

  const document = SwaggerModule.createDocument( app, config );
  SwaggerModule.setup( 'api', app, document, {
    jsonDocumentUrl: 'swagger/json',
    yamlDocumentUrl: 'swagger/yaml',
    swaggerOptions: {
      persistAuthorization: true,
    }
  } );

  app.enableCors( { origin: 'http://localhost:4200' } );

  await app.listen( process.env.port ?? 3000 );
}

void bootstrap();
