import {
    Controller,
    Content,
    QueryParam,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Cookie
} from "https://deno.land/x/alosaur/src/mod.ts";
import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { BillLogic } from "../logic/bill-logic.ts";
import { DiscountLogic } from "../logic/discount-logic.ts";
import { Authorize, AuthorizationToken } from "../logic/authorization.ts";
import { Role } from "../domain-model/role.ts";

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
    @Authorize([Role.Permission.Bill_Write])
    async addBill(
        @QueryParam("tableId") tableId: string,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.billLogic.addBill(tableId));
    }

    @Put("/modify")
    @Authorize([Role.Permission.Bill_Write])
    async modifyBill(
        @QueryParam("id") id: string,
        @QueryParam("tableId") tableId: string,
        @QueryParam("discountAmount") discountAmount: number,
        @QueryParam("discountPercentage") discountPercentage: number,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.billLogic.modifyBill(id, tableId));
    }

    @Put("/discount")
    @Authorize([Role.Permission.Bill_Write])
    async addBillDiscount(
        @QueryParam("id") id: string,
        @QueryParam("discountId") discountId: string,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.billLogic.modifyBill(id, undefined, discountId));
    }

    @Put("/close")
    @Authorize([Role.Permission.Bill_Write])
    async closeBill(
        @QueryParam("id") id: string,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.billLogic.closeBill(id) || "");
    }

    //For pickup or delivery bills, tableid = pickup/delivery

    @Get("/item")
    @Authorize([Role.Permission.BillItem_Read])
    async getItem(
        @QueryParam("id") id: string,
        @QueryParam("billId") billId: string,
        @QueryParam("hasPaid") hasPaid: string,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.billLogic.getBillItem(id, billId, hasPaid));
    }

    @Post("/item/add")
    @Authorize([Role.Permission.BillItem_Write])
    async addItem(
        @QueryParam("billId") billId: string,
        @QueryParam("menuItemId") menuItemId: string,
        @QueryParam("quantity") quantity: number,
        @QueryParam("groupId") groupId: number,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.billLogic.addBillItem(billId, menuItemId, quantity, groupId));
    }

    @Put("/item/modify")
    @Authorize([Role.Permission.BillItem_Write])
    async modifyItem(
        @QueryParam("id") id: string,
        @QueryParam("quantity") quantity: number,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.billLogic.modifyBillItem(id, quantity));
    }

    @Put("/item/disount")
    @Authorize([Role.Permission.BillItem_Write])
    async addBillItemDiscount(
        @QueryParam("id") id: string,
        @QueryParam("discountId") discountId: string,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.billLogic.modifyBillItem(id, undefined, discountId));
    }

    @Put("/item/group")
    @Authorize([Role.Permission.BillItem_Write])
    async groupItem(
        @QueryParam("groupId") groupId: number,
        @Cookie("token") @AuthorizationToken authorizationToken: string,
        @Body() billItemIdList: string[]
    ) {
        if (billItemIdList) {
            return Content(await this.billLogic.groupBillItem(billItemIdList, groupId));
        }
        return Content("");
    }

    @Delete("/item")
    @Authorize([Role.Permission.BillItem_Write])
    async deleteItem(
        @QueryParam("id") id: string,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        if (id) {
            return Content(await this.billLogic.deleteBillItem(id));
        } else {
            return Content("");
        }
    }

    @Put("/item/split")
    @Authorize([Role.Permission.BillItem_Write])
    async splitItem(
        @QueryParam("quantity") quantity: number,
        @Cookie("token") @AuthorizationToken authorizationToken: string,
        @Body() billItemIdList: string[]
    ) {
        if (quantity && billItemIdList) {
            return Content(await this.billLogic.splitBillItem(billItemIdList, quantity));
        }
        return Content("");
    }

    @Put("/item/combine")
    @Authorize([Role.Permission.BillItem_Write])
    async combineItem(
        @Body() billItemIdList: string[],
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        if (billItemIdList) {
            return Content(await this.billLogic.combineBillItems(billItemIdList));
        }
        return Content("");
    }

    @Get("/discount")
    @Authorize([Role.Permission.BillItem_Read])
    async getDiscount(
        @QueryParam("id") id: string,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.discountLogic.get(id));
    }

    @Post("/discount/add")
    @Authorize([Role.Permission.BillItem_Write])
    async createDiscount(
        @QueryParam("name") name: string,
        @QueryParam("type") type: string,
        @QueryParam("amount") amount: number,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.discountLogic.add(name, type, amount));
    }

    @Put("/discount/modify")
    @Authorize([Role.Permission.BillItem_Write])
    async modifyDiscount(
        @QueryParam("id") id: string,
        @QueryParam("name") name: string,
        @QueryParam("type") type: string,
        @QueryParam("amount") amount: number,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.discountLogic.modify(id, name, type, amount));
    }
}