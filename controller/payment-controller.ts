import {
  Controller,
  Content,
  Body,
  Post,
  QueryParam,
  Get
} from "https://deno.land/x/alosaur/src/mod.ts";
import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
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
    @QueryParam("time") time: string,
    @QueryParam("cashPayAmount") cashPayAmount: number,
    @QueryParam("cardPayAmount") cardPayAmount: number,
    @QueryParam("changeGiven") changeGiven: number,
    @Body() billItemIdList: string[]
  ) {
    return Content(await this.paymentLogic.pay(billId, time, cashPayAmount, cardPayAmount, changeGiven, billItemIdList));
  }
}