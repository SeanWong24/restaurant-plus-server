import {
    Controller,
    Content,
    QueryParam,
    Get,
    Post,
    Put,
    Delete,
    Body
} from "https://deno.land/x/alosaur/src/mod.ts";
import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { BillLogic } from "../logic/bill-logic.ts";
import { DiscountLogic } from "../logic/discount-logic.ts";

@Injectable()
@Controller("/bill")
export class BillController {
    constructor(private billLogic: BillLogic, private discountLogic: DiscountLogic) { }

    @Get("")
    async getBill(
        @QueryParam("id") id: string,
        @QueryParam("tableId") tableId: string,
        @QueryParam("status") status: string
    ) {
        return Content(await this.billLogic.getBill(id, tableId, status));
    }

    @Post("/add")
    async addBill(
        @QueryParam("tableId") tableId: string
    ) {
        return Content(await this.billLogic.addBill(tableId));
    }

    @Put("/modify")
    async modifyBill(
        @QueryParam("id") id: string,
        @QueryParam("tableId") tableId: string,
        @QueryParam("discountAmount") discountAmount: number,
        @QueryParam("discountPercentage") discountPercentage: number
    ) {
        return Content(await this.billLogic.modifyBill(id, tableId));
    }

    @Put("/discount")
    async addBillDiscount(
        @QueryParam("id") id: string,
        @QueryParam("discountId") discountId: string
    ) {
        return Content(await this.billLogic.modifyBill(id, undefined ,discountId));
    }

    @Put("/close")
    async closeBill(
        @QueryParam("id") id: string
    ) {
        return Content(await this.billLogic.closeBill(id) || "");
    }

    //For pickup or delivery bills, tableid = pickup/delivery
    
    @Get("/item")
    async getItem(
        @QueryParam("id") id: string,
        @QueryParam("billId") billId: string,
        @QueryParam("hasPaid") hasPaid: string
    ) {
        return Content(await this.billLogic.getBillItem(id, billId, hasPaid));
    }

    @Post("/item/add")
    async addItem(
        @QueryParam("billId") billId: string,
        @QueryParam("menuItemId") menuItemId: string,
        @QueryParam("quantity") quantity: number,
        @QueryParam("groupId") groupId: number
    ) {
        return Content(await this.billLogic.addBillItem(billId, menuItemId, quantity, groupId));
    }

    @Put("/item/modify")
    async modifyItem(
        @QueryParam("id") id: string,
        @QueryParam("quantity") quantity: number
    ) {
        return Content(await this.billLogic.modifyBillItem(id, quantity));
    }

    @Put("/item/disount")
    async addBillItemDiscount(
        @QueryParam("id") id:string,
        @QueryParam("discountId") discountId: string
    ) {
        return Content(await this.billLogic.modifyBillItem(id, undefined, discountId));
    }

    @Put("/item/group")
    async groupItem(
        @QueryParam("groupId") groupId: number,
        @Body() billItemIdList: string[]
    ) {
        if (billItemIdList) {
            return Content(await this.billLogic.groupBillItem(billItemIdList, groupId));
        }
        return Content("");
    }

    @Delete("/item")
    async deleteItem(
        @QueryParam("id") id: string
    ) {
        if (id) {
            return Content(await this.billLogic.deleteBillItem(id));
        } else {
            return Content("");
        }
    }

    @Put("/item/split")
    async splitItem(
        @QueryParam("quantity") quantity: number,
        @Body() billItemIdList: string[]
    ) {
        if (quantity && billItemIdList) {
            return Content(await this.billLogic.splitBillItem(billItemIdList, quantity));
        }
        return Content("");
    }

    @Put("/item/combine")
    async combineItem(@Body() billItemIdList: string[]) {
        if (billItemIdList) {
            return Content(await this.billLogic.combineBillItems(billItemIdList));
        }
        return Content("");
    }

    @Get("/discount")
    async getDiscount(@QueryParam("id") id: string) {
        return Content(await this.discountLogic.get(id));
    }

    @Post("/discount/add")
    async createDiscount(
        @QueryParam("name") name: string,
        @QueryParam("type") type: string,
        @QueryParam("amount") amount: number) {
            return Content(await this.discountLogic.add(name, type, amount));
        }
    
    @Put("/discount/modify")
    async modifyDiscount(
        @QueryParam("id") id: string,
        @QueryParam("name") name: string,
        @QueryParam("type") type: string,
        @QueryParam("amount") amount: number
    ) {
        return Content(await this.discountLogic.modify(id, name, type, amount));
    }
}