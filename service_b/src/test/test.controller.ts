import { Controller, Post, Query } from '@nestjs/common';
import { TestService } from './test.service';


@Controller("test")
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post("inverse-total")
  InverseTotal(@Query("num_1") num_1: number , @Query("num_2") num_2: number) {
    return this.testService.getInverseTotal(num_1, num_2);
  }


}