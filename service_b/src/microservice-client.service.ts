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
