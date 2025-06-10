import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { MicroserviceServerService } from './microservice-server.service';


interface CalcRequest {
  a: number;
  b: number;
}

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