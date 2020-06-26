import {
  Controller,
  Body,
  Post,
  QueryParam,
  Get,
  Singleton,
  UseHook,
} from "../deps/alosaur.ts";
import { PaymentLogic } from "../logic/payment-logic.ts";
import { LogHook } from "../utilities/log-hook.ts";

@Singleton()
@UseHook(LogHook)
@Controller("/payment")
export class PaymentController {
  constructor(private paymentLogic: PaymentLogic) {}

  @Get("")
  async get(
    @QueryParam("id") id: string,
    @QueryParam("billId") billId: string,
  ) {
    if (id) {
      return await this.paymentLogic.get({ id });
    } else {
      const filter = {
        billId: billId,
      };
      return await this.paymentLogic.get(filter);
    }
  }

  @Post("/pay")
  async pay(
    @QueryParam("billId") billId: string,
    @QueryParam("cashPayAmount") cashPayAmount: number,
    @QueryParam("cardPayAmount") cardPayAmount: number,
    @QueryParam("changeGiven") changeGiven: number,
    @Body() billItemIdList: string[],
  ) {
    return await this.paymentLogic.pay(
      billId,
      cashPayAmount,
      cardPayAmount,
      changeGiven,
      billItemIdList,
    );
  }
}
