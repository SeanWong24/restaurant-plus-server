import {
  Controller,
  Content,
  Body,
  Post,
  QueryParam,
  Get
} from "https://raw.githubusercontent.com/SeanWong24/alosaur/cors-builder/src/mod.ts";
import { Injectable } from "https://raw.githubusercontent.com/SeanWong24/alosaur/cors-builder/src/mod.ts";
import { PaymentLogic } from "../logic/payment-logic.ts";

@Injectable()
@Controller("/payment")
export class PaymentController {
  constructor(private paymentLogic: PaymentLogic) { }

  @Get("")
  async get(
    @QueryParam("id") id: string,
    @QueryParam("billId") billId: string
  ) {
    return Content(await this.paymentLogic.get(id, billId));
  }

  @Post("/pay")
  async pay(
    @QueryParam("billId") billId: string,
    @QueryParam("cashPayAmount") cashPayAmount: number,
    @QueryParam("cardPayAmount") cardPayAmount: number,
    @QueryParam("changeGiven") changeGiven: number,
    @Body() billItemIdList: string[]
  ) {
    return Content(await this.paymentLogic.pay(billId, cashPayAmount, cardPayAmount, changeGiven, billItemIdList));
  }
}