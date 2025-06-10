import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { MicroserviceClientService } from '../microservice-client.service';

@Module({
  imports: [],
  providers:[TestService , MicroserviceClientService],
  controllers:[TestController],
})
export class TestModule {}
