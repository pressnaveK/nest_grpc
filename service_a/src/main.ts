import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options:{
      package: "calc",
      protoPath:'src/proto/server/calc.proto',
      url: `0.0.0.0:${process.env.GRPC_PORT}`,
      loader:{
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
