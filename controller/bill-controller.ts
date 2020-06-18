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
  Singleton,
  UseHook,
} from "../deps/alosaur.ts";
import { BillLogic } from "../logic/bill-logic.ts";
import { DiscountLogic } from "../logic/discount-logic.ts";
import { Role } from "../domain-model/role.ts";
import { Bill } from "../domain-model/bill.ts";
import { LogHook } from "../utilities/log-hook.ts";
import {
  AuthorizationHook,
  AuthorizationOptions,
} from "../utilities/authorization-hook.ts";

@Singleton()
@UseHook(LogHook)
@Controller("/bill")
export class BillController {
  constructor(
    private billLogic: BillLogic,
    private discountLogic: DiscountLogic,
  ) {}

  @Get("")
  async getBill(
    @QueryParam("id") id: string,
    @QueryParam("tableId") tableId: string,
    @QueryParam("status") status: string,
    @QueryParam("timeFrom") timeFrom: string,
    @QueryParam("timeTo") timeTo: string,
  ) {
    if (id) {
      return Content(await this.billLogic.getBill({ id }));
    } else {
      const filter = {
        tableId,
        status,
        timeFrom,
        timeTo,
      };
      return Content(await this.billLogic.getBill(filter));
    }
  }

  @Get("/togo")
  async getTogo() {
    return Content(await this.billLogic.getTogo());
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.Bill_Write] },
    ),
  )
  @Post("/add")
  async addBill(@QueryParam("tableId") tableId: string) {
    return Content(await this.billLogic.addBill(tableId));
  }

  @Post("/add/togo")
  async addTogo(@QueryParam("togoType") togoType: string) {
    return Content(await this.billLogic.addTogo(togoType));
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.Bill_Write] },
    ),
  )
  @Put("/modify")
  async modifyBill(
    @QueryParam("id") id: string,
    @QueryParam("tableId") tableId: string,
  ) {
    const changeDefinition: Partial<Bill> = {};
    if (tableId) {
      changeDefinition.tableId = tableId;
    }
    return Content(await this.billLogic.modify(id, changeDefinition));
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.Bill_Write] },
    ),
  )
  @Put("/discount")
  async addDiscountToBill(
    @QueryParam("id") id: string,
    @QueryParam("discountId") discountId: string,
    @QueryParam("groupId") groupId: number,
  ) {
    return Content(
      await this.billLogic.addDiscountToBill(id, discountId, groupId),
    );
  }

  @Put("/remove/discount")
  async removeDiscountFromBill(
    @QueryParam("id") id: string,
    @QueryParam("discountId") discountId: string,
    @QueryParam("groupId") groupId: number,
  ) {
    return Content(
      await this.billLogic.removeDiscountFromBill(id, discountId, groupId),
    );
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.Bill_Write] },
    ),
  )
  @Put("/close")
  async closeBill(@QueryParam("id") id: string) {
    return Content(await this.billLogic.closeBill(id) || "");
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.BillItem_Read] },
    ),
  )
  @Get("/item")
  async getItem(
    @QueryParam("id") id: string,
    @QueryParam("billId") billId: string,
    @QueryParam("hasPaid") hasPaid: string,
    @QueryParam("groupId") groupId: number,
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

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.BillItem_Write] },
    ),
  )
  @Post("/item/add")
  async addItem(
    @QueryParam("billId") billId: string,
    @QueryParam("menuItemId") menuItemId: string,
    @QueryParam("quantity") quantity: number,
    @QueryParam("groupId") groupId: number,
    @Body() selectedMenuItemInfoList: Map<string, string>[],
    @Cookie("token") authorizationToken: string,
  ) {
    return Content(
      await this.billLogic.addBillItem(
        billId,
        menuItemId,
        quantity,
        groupId,
        1,
      ),
    );
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.BillItem_Write] },
    ),
  )
  @Put("/item/modify")
  async modifyItem(
    @QueryParam("id") id: string,
    @QueryParam("quantity") quantity: number,
  ) {
    const changeDefinition = {} as any;
    if (quantity) changeDefinition["quantity"] = quantity;
    return Content(await this.billLogic.modifyItem(id, changeDefinition));
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.BillItem_Write] },
    ),
  )
  @Put("/item/discount")
  async addDiscountToBillItem(
    @QueryParam("discountId") discountId: string,
    @Body() billItemIdList: string[],
  ) {
    return Content(
      await this.billLogic.addDiscountToBillItem(discountId, billItemIdList),
    );
  }

  @Put("/item/remove/discount")
  async removeDiscountFromBillItem(
    @QueryParam("id") id: string,
    @QueryParam("discountId") discountId: string,
  ) {
    return Content(
      await this.billLogic.removeDiscountFromBillItem(id, discountId),
    );
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.BillItem_Write] },
    ),
  )
  @Put("/item/group")
  async groupItem(
    @QueryParam("groupId") groupId: number,
    @Body() billItemIdList: string[],
  ) {
    if (billItemIdList) {
      return Content(
        await this.billLogic.groupBillItem(billItemIdList, groupId),
      );
    }
    return Content("");
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.BillItem_Write] },
    ),
  )
  @Delete("/item")
  async deleteItem(@Body() selectedItemIdList: string[]) {
    if (selectedItemIdList) {
      return Content(await this.billLogic.deleteBillItem(selectedItemIdList));
    } else {
      return Content("");
    }
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.BillItem_Write] },
    ),
  )
  @Put("/item/split")
  async splitItem(
    @QueryParam("quantity") quantity: number,
    @Body() billItemIdList: string[],
  ) {
    if (quantity && billItemIdList) {
      return Content(
        await this.billLogic.splitBillItem(billItemIdList, quantity),
      );
    }
    return Content("");
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.BillItem_Write] },
    ),
  )
  @Put("/item/combine")
  async combineItem(@Body() billItemIdList: string[]) {
    if (billItemIdList) {
      return Content(await this.billLogic.combineBillItems(billItemIdList));
    }
    return Content("");
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.BillItem_Read] },
    ),
  )
  @Post("/discount")
  async getDiscount(@Body() discountIdList?: string[]) {
    return Content(await this.discountLogic.get(discountIdList));
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.BillItem_Write] },
    ),
  )
  @Post("/discount/add")
  async createDiscount(
    @QueryParam("name") name: string,
    @QueryParam("type") type: string,
    @QueryParam("value") value: number,
    @QueryParam("status") status: string,
  ) {
    return Content(await this.discountLogic.add(name, type, value, status));
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.BillItem_Write] },
    ),
  )
  @Put("/discount/modify")
  async modifyDiscount(
    @QueryParam("id") id: string,
    @QueryParam("name") name: string,
  ) {
    const changeDefinition = {} as any;
    if (name) {
      changeDefinition["name"] = name;
    }
    return Content(await this.discountLogic.modify(id, changeDefinition));
  }

  @UseHook(
    AuthorizationHook,
    Object.assign(
      new AuthorizationOptions(),
      { permissionList: [Role.Permission.BillItem_Write] },
    ),
  )
  @Put("/discount/toggle-availability")
  async toggleAvailability(
    @QueryParam("id") id: string,
  ) {
    return Content(await this.discountLogic.toggleAvailability(id));
  }
}
