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
import { authorize } from "../logic/authorization.ts";
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
    @authorize(Role.Permission.Bill_Write, 1)
    async addBill(
        @QueryParam("tableId") tableId: string,
        @Cookie("token") authorizationToken: string
    ) {
        return Content(await this.billLogic.addBill(tableId));
    }

    @Put("/modify")
    @authorize(Role.Permission.Bill_Write, 4)
    async modifyBill(
        @QueryParam("id") id: string,
        @QueryParam("tableId") tableId: string,
        @QueryParam("discountAmount") discountAmount: number,
        @QueryParam("discountPercentage") discountPercentage: number,
        @Cookie("token") authorizationToken: string
    ) {
        return Content(await this.billLogic.modifyBill(id, tableId));
    }

    @Put("/discount")
    @authorize(Role.Permission.Bill_Write, 2)
    async addBillDiscount(
        @QueryParam("id") id: string,
        @QueryParam("discountId") discountId: string,
        @Cookie("token") authorizationToken: string
    ) {
        return Content(await this.billLogic.modifyBill(id, undefined ,discountId));
    }

    @Put("/close")
    @authorize(Role.Permission.Bill_Write, 1)
    async closeBill(
        @QueryParam("id") id: string,
        @Cookie("token") authorizationToken: string
    ) {
        return Content(await this.billLogic.closeBill(id) || "");
    }

    //For pickup or delivery bills, tableid = pickup/delivery
    
    @Get("/item")
    @authorize(Role.Permission.BillItem_Read, 3)
    async getItem(
        @QueryParam("id") id: string,
        @QueryParam("billId") billId: string,
        @QueryParam("hasPaid") hasPaid: string,
        @Cookie("token") authorizationToken: string
    ) {
        return Content(await this.billLogic.getBillItem(id, billId, hasPaid));
    }

    @Post("/item/add")
    @authorize(Role.Permission.BillItem_Write, 4)
    async addItem(
        @QueryParam("billId") billId: string,
        @QueryParam("menuItemId") menuItemId: string,
        @QueryParam("quantity") quantity: number,
        @QueryParam("groupId") groupId: number,
        @Cookie("token") authorizationToken: string
    ) {
        return Content(await this.billLogic.addBillItem(billId, menuItemId, quantity, groupId));
    }

    @Put("/item/modify")
    @authorize(Role.Permission.BillItem_Write, 2)
    async modifyItem(
        @QueryParam("id") id: string,
        @QueryParam("quantity") quantity: number,
        @Cookie("token") authorizationToken: string
    ) {
        return Content(await this.billLogic.modifyBillItem(id, quantity));
    }

    @Put("/item/disount")
    @authorize(Role.Permission.BillItem_Write, 2)
    async addBillItemDiscount(
        @QueryParam("id") id:string,
        @QueryParam("discountId") discountId: string,
        @Cookie("token") authorizationToken: string
    ) {
        return Content(await this.billLogic.modifyBillItem(id, undefined, discountId));
    }

    @Put("/item/group")
    @authorize(Role.Permission.BillItem_Write, 1)
    async groupItem(
        @QueryParam("groupId") groupId: number,
        @Cookie("token") authorizationToken: string,
        @Body() billItemIdList: string[]
    ) {
        if (billItemIdList) {
            return Content(await this.billLogic.groupBillItem(billItemIdList, groupId));
        }
        return Content("");
    }

    @Delete("/item")
    @authorize(Role.Permission.BillItem_Write, 1)
    async deleteItem(
        @QueryParam("id") id: string,
        @Cookie("token") authorizationToken: string
    ) {
        if (id) {
            return Content(await this.billLogic.deleteBillItem(id));
        } else {
            return Content("");
        }
    }

    @Put("/item/split")
    @authorize(Role.Permission.BillItem_Write, 1)
    async splitItem(
        @QueryParam("quantity") quantity: number,
        @Cookie("token") authorizationToken: string,
        @Body() billItemIdList: string[]
    ) {
        if (quantity && billItemIdList) {
            return Content(await this.billLogic.splitBillItem(billItemIdList, quantity));
        }
        return Content("");
    }

    @Put("/item/combine")
    @authorize(Role.Permission.BillItem_Write, 1)
    async combineItem(
        @Body() billItemIdList: string[],
        @Cookie("token") authorizationToken: string
        ) {
        if (billItemIdList) {
            return Content(await this.billLogic.combineBillItems(billItemIdList));
        }
        return Content("");
    }

    @Get("/discount")
    @authorize(Role.Permission.BillItem_Read, 1)
    async getDiscount(
        @QueryParam("id") id: string,
        @Cookie("token") authorizationToken: string
        ) {
        return Content(await this.discountLogic.get(id));
    }

    @Post("/discount/add")
    @authorize(Role.Permission.BillItem_Write, 3)
    async createDiscount(
        @QueryParam("name") name: string,
        @QueryParam("type") type: string,
        @QueryParam("amount") amount: number,
        @Cookie("token") authorizationToken: string
        ) {
            return Content(await this.discountLogic.add(name, type, amount));
        }
    
    @Put("/discount/modify")
    @authorize(Role.Permission.BillItem_Write, 4)
    async modifyDiscount(
        @QueryParam("id") id: string,
        @QueryParam("name") name: string,
        @QueryParam("type") type: string,
        @QueryParam("amount") amount: number,
        @Cookie("token") authorizationToken: string
    ) {
        return Content(await this.discountLogic.modify(id, name, type, amount));
    }
}