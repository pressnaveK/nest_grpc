import { Module } from '@nestjs/common';
import { MicroserviceClientService } from './microservice-client.service';
import { TestModule } from './test/test.module';

@Module({
  imports: [TestModule],
  controllers: [],
  providers: [MicroserviceClientService],
  exports: [MicroserviceClientService],
})
export class AppModule {}
