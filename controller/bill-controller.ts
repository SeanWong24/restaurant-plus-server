import {
    Controller,
    Content,
    QueryParam,
    Get,
    Post,
    Put,
    Delete,
    Body
} from "https://raw.githubusercontent.com/SeanWong24/alosaur/cors-builder/src/mod.ts";
import { Injectable } from "https://raw.githubusercontent.com/SeanWong24/alosaur/cors-builder/src/mod.ts";
import { BillLogic } from "../logic/bill-logic.ts";

@Injectable()
@Controller("/bill")
export class BillController {
    constructor(private billLogic: BillLogic) { }

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
        if (id) {
            const changeDefinition = {} as any;
            if (tableId) {
                changeDefinition["tableId"] = tableId;
            }
            if (discountAmount) {
                changeDefinition["discountAmount"] = discountAmount;
            }
            if (discountPercentage) {
                changeDefinition["discountPercentage"] = discountPercentage;
            }
            return Content(await this.billLogic.modifyBill(id, changeDefinition));
        } else {
            return Content("");
        }
    }

    @Put("/close")
    async closeBill(
        @QueryParam("id") id: string
    ) {
        return Content(await this.billLogic.closeBill(id) || "");
    }


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
        if (id) {
            const changeDefinition = {} as any;
            if (quantity) {
                changeDefinition["quantity"] = quantity;
            }
            return Content(await this.billLogic.modifyBillItem(id, changeDefinition));
        }
        return Content("");
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
}