import {
    Controller,
    Content,
    QueryParam,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Cookie,
    Injectable
} from "../external-modules/alosaur.ts";
import { BillLogic } from "../logic/bill-logic.ts";
import { DiscountLogic } from "../logic/discount-logic.ts";
import { Authorize, AuthorizationToken } from "../logic/authorization.ts";
import { Role } from "../domain-model/role.ts";
import { Bill } from "../domain-model/bill.ts";

@Injectable()
@Controller("/bill")
export class BillController {
    constructor(private billLogic: BillLogic, private discountLogic: DiscountLogic) { }

    @Get("")
    async getBill(
        @QueryParam("id") id: string,
        @QueryParam("tableId") tableId: string,
        @QueryParam("status") status: string,
        @QueryParam("timeFrom") timeFrom: string,
        @QueryParam("timeTo") timeTo: string
    ) {
        if (id) {
            return Content(await this.billLogic.getBill({ id }));
        } else {
            const filter = {
                tableId,
                status,
                timeFrom,
                timeTo
            }
            return Content(await this.billLogic.getBill(filter));
        }
    }

    @Post("/add")
    @Authorize([Role.Permission.Bill_Write])
    async addBill(
        @QueryParam("tableId") tableId: string,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.billLogic.addBill(tableId));
    }

    @Post("/add/togo")
    async addTogo(@QueryParam("togoType") togoType: string) {
        return Content(await this.billLogic.addTogo(togoType))
    }

    @Put("/modify")
    @Authorize([Role.Permission.Bill_Write])
    async modifyBill(
        @QueryParam("id") id: string,
        @QueryParam("tableId") tableId: string,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        const changeDefinition: Partial<Bill> = {};
        if (tableId) {
            changeDefinition.tableId = tableId;
        }
        return Content(await this.billLogic.modify(id, changeDefinition));
    }

    @Put("/discount")
    @Authorize([Role.Permission.Bill_Write])
    async addDiscountToBill(
        @QueryParam("id") id: string,
        @QueryParam("discountId") discountId: string,
        @QueryParam("groupId") groupId: number,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.billLogic.addDiscountToBill(id, discountId, groupId));
    }

    @Put("/remove/discount")
    async removeDiscountFromBill(
        @QueryParam("id") id: string,
        @QueryParam("discountId") discountId: string,
        @QueryParam("groupId") groupId: number,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.billLogic.removeDiscountFromBill(id, discountId, groupId));
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
        @QueryParam("groupId") groupId: number,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        if (id) {
            return Content(await this.billLogic.getBillItem({ id }));
        } else {
            const filter = {} as any;
            if (billId) {
                filter["billId"] = billId;
            }
            if (hasPaid) {
                if (JSON.parse(hasPaid.toLowerCase())) {
                    filter["paymentId"] = { $ne: "" };
                } else {
                    filter["paymentId"] = "";
                }
            }
            if (groupId) {
                filter["groupId"] = groupId;
            }
            return Content(await this.billLogic.getBillItem(filter));
        }
    }

    @Post("/item/add")
    @Authorize([Role.Permission.BillItem_Write])
    async addItem(
        @QueryParam("billId") billId: string,
        @QueryParam("menuItemId") menuItemId: string,
        @QueryParam("quantity") quantity: number,
        @QueryParam("groupId") groupId: number,
        @Body() selectedMenuItemInfoList: Map<string, string>[],
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.billLogic.addBillItem(billId, menuItemId, quantity, groupId, 1));
    }

    @Put("/item/modify")
    @Authorize([Role.Permission.BillItem_Write])
    async modifyItem(
        @QueryParam("id") id: string,
        @QueryParam("quantity") quantity: number,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        const changeDefinition = {} as any;
        if (quantity) { changeDefinition["quantity"] = quantity; }
        return Content(await this.billLogic.modifyItem(id, changeDefinition));
    }

    @Put("/item/discount")
    @Authorize([Role.Permission.BillItem_Write])
    async addDiscountToBillItem(
        @QueryParam("id") id: string,
        @QueryParam("discountId") discountId: string,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.billLogic.addDiscountToBillItem(id, discountId));
    }

    @Put("/item/remove/discount")
    async removeDiscountFromBillItem(
        @QueryParam("id") id: string,
        @QueryParam("discountId") discountId: string,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.billLogic.removeDiscountFromBillItem(id, discountId))
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
        @Body() selectedItemIdList: string[],
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        if (selectedItemIdList) {
            return Content(await this.billLogic.deleteBillItem(selectedItemIdList));
        } else {
            return Content("");
        }
    }

    @Put("/item/split")
    // @Authorize([Role.Permission.BillItem_Write])
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
    // @Authorize([Role.Permission.BillItem_Write])
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
    // @Authorize([Role.Permission.BillItem_Read])
    async getDiscount(
        @QueryParam("id") id: string,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.discountLogic.get({ id }));
    }

    @Post("/discount/add")
    // @Authorize([Role.Permission.BillItem_Write])
    async createDiscount(
        @QueryParam("name") name: string,
        @QueryParam("type") type: string,
        @QueryParam("amount") amount: number,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        return Content(await this.discountLogic.add(name, type, amount));
    }

    @Put("/discount/modify")
    // @Authorize([Role.Permission.BillItem_Write])
    async modifyDiscount(
        @QueryParam("id") id: string,
        @QueryParam("name") name: string,
        @QueryParam("type") type: string,
        @QueryParam("value") value: number,
        @Cookie("token") @AuthorizationToken authorizationToken: string
    ) {
        const changeDefinition = {} as any;
        if (name) {
            changeDefinition["name"] = name;
        }
        if (type) {
            changeDefinition["type"] = type;
        }
        if (value) {
            changeDefinition["value"] = value;
        }
        return Content(await this.discountLogic.modify(id, changeDefinition));
    }
}