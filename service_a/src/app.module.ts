import { Module } from '@nestjs/common';
import { MicroserviceServerController } from './microservice-server.controller';
import { MicroserviceServerService } from './microservice-server.service';

@Module({
  imports: [],
  controllers: [MicroserviceServerController],
  providers: [MicroserviceServerService],
})
export class AppModule {}
