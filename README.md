# GRPC Communication Nest

Here In service-a , GRPC server has implemented and In B client has implemented.

### calc.proto
```
syntax = "proto3";
import "common_messages.proto";

package  calc;

service CalcService{
  rpc Add (CalcRequest) returns (CalcResponse);
  rpc Multiply(CalcRequest) returns (CalcResponse);
}
  
```

### common_messages.proto
```
syntax = "proto3";

package calc;

message CalcRequest{
  double a = 1;
  double b = 2;
}

message CalcResponse{
  double result_calc = 1;
}
  
```
### service_a/src/microservice-server.controller.ts
```
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { MicroserviceServerService } from './microservice-server.service';

//Define Request Body
interface CalcRequest {
  a: number;
  b: number;
}

//Define Response Body
interface CalcResponse {
  result_calc: number;
}

@Controller()
export class MicroserviceServerController {
  constructor(private readonly microserviceServerService: MicroserviceServerService) {}

  //GRPC ADD
  @GrpcMethod("CalcService" , "Add")
  add({a , b}: CalcRequest ):CalcResponse {
    //Parse the value from GRPC then get the results and set it into GRPC Response
    const total = this.microserviceServerService.add(a , b)
    return {result_calc:total};
  }

  //GRPC Multiply
  @GrpcMethod("CalcService" , "Multiply")
  multiply({a , b}: CalcRequest ):CalcResponse {
    //Parse the value from GRPC then get the results and set it into GRPC Response
    const product = this.microserviceServerService.multiply(a , b);
    return {result_calc:product};
  }

}

```
### service_a/src/main.ts
```
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

```
### service_b/src/microservice-client.service.ts

```
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import * as dotenv from 'dotenv';
dotenv.config();

interface CalcRequest {
  a: number;
  b: number;
}

interface CalcResponse {
  result_calc: number;
}
interface CalcService {
  Add(data:CalcRequest): Observable<CalcResponse>;
  Multiply(data:CalcRequest): Observable<CalcResponse>;
}
export interface SuccessBody{
  value: number | null;
  success: boolean;
  message: string;
}

@Injectable()
export class MicroserviceClientService implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'calc',
      protoPath: 'src/proto/client/calc.proto',
      url: process.env.GRPC_URL,
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    },
  })
  private client: ClientGrpc;
  private calcService: CalcService;

  //To initiate something during the build
  onModuleInit(): void {
    this.calcService = this.client.getService<CalcService>('CalcService');
  }

  async add(num_1: number, num_2: number): Promise<SuccessBody> {
    try {
      const response: CalcResponse = await firstValueFrom(
        this.calcService.Add({ a: num_1, b: num_2 })
      );
      return {
        value: response.result_calc,
        success: true,
        message: 'success',
      };
    } catch (error) {
      return {
        value: null,
        success: false,
        message: error.message,
      };
    }
  }
  async multiply( num_1: number , num_2: number ): Promise<SuccessBody> {
    try {
      const response: CalcResponse = await firstValueFrom(
        this.calcService.Multiply({ a: num_1, b: num_2 })
      );
      return {
        value: response.result_calc,
        success: true,
        message: 'success',
      };
    } catch (error) {
      return {
        value: null,
        success: false,
        message: error.message,
      };
    }
  }

}

```
 Run both services and run below script

 ```
curl -X POST "http://localhost:3000/test/inverse-total?num_1=8&num_2=6"
{"success":true,"value":0.2916666666666667,"message":"success"}
```
