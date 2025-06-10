import { Injectable } from '@nestjs/common';

@Injectable()
export class MicroserviceServerService {
  add(num1:number , num2:number):number {
    return num1 + num2;
  }

  multiply(num1:number, num2:number):number {
    return num1 * num2;
  }
}