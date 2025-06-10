import { Injectable } from '@nestjs/common';
import { MicroserviceClientService, SuccessBody } from '../microservice-client.service';



type ResponseBody = {
  success: boolean,
  value: number| null,
  message: string
}
@Injectable()
export class TestService {
  constructor(private readonly microserviceClientService: MicroserviceClientService) {
  }
  async getInverseTotal(num_1:number , num_2:number):Promise<ResponseBody> {
    const sum_result:SuccessBody = await this.microserviceClientService.add(num_1, num_2);
    const product_result: SuccessBody = await this.microserviceClientService.multiply(num_1, num_2);
    let value:number| null = null
    let success: boolean = false;
    if(sum_result.success && product_result.success){
      if(sum_result.value && product_result.value) value = sum_result.value / product_result.value;
      success = true;
    }
    return{success, value , message:sum_result.message}
  }
}