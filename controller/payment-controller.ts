import {
  Controller,
  Content,
  Body,
  Post,
  QueryParam,
  Get
} from "https://deno.land/x/alosaur/src/mod.ts";
import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";

@Injectable()
@Controller("/payment")
export class PaymentController {
  constructor() { }

  @Get("")
  async get(
    @QueryParam("id") id: string,
    @QueryParam("billId") billId: string
  ) {
    // TODO implement the logic and return the payment or payment list
    return Content("");
  }

  @Post("/pay")
  async pay(
    @QueryParam("billId") billId: string,
    @QueryParam("time") time: string,
    @QueryParam("cashPayAmount") cashPayAmount: number,
    @QueryParam("cardPayAmount") cardPayAmount: number,
    @QueryParam("changeGiven") changeGiven: number,
    @QueryParam("billItemIdList") billItemIdList: string[]
  ) {
    // TODO implement the logic
    return Content("");
  }
}