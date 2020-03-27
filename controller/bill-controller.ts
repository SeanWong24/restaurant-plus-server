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

@Injectable()
@Controller("/bill")
export class BillController {
    constructor() { }

    @Get("")
    async get(
        @QueryParam("id") id: string,
        @QueryParam("tableId") tableId: string,
        @QueryParam("status") status: string,
    ) {
        // TODO implement the logic and return the bill or bill list
        return Content("");
    }

    @Post("/add")
    async add(@QueryParam("tableId") tableId: string) {
        // TODO implement the logic
        return Content("");
    }

    @Put("/modify")
    async modify(@QueryParam("id") id: string, @QueryParam("tableId") tableId: string) {
        // TODO implement the logic
        return Content("");
    }


    @Get("/item")
    async getItem(
        @QueryParam("id") id: string,
        @QueryParam("billId") billId: string,
        @QueryParam("hasPaid") hasPaid: boolean
    ) {
        // TODO implement the logic and return the bill item or bill item list
        return Content("");
    }

    @Post("/item/add")
    async addItem(
        @QueryParam("billId") billId: string,
        @QueryParam("menuItemId") menuItemId: string,
        @QueryParam("quantity") quantity: number
    ) {
        // TODO implement the logic
        return Content("");
    }

    @Put("/item/modify")
    async modifyItem(
        @QueryParam("id") id: string,
        @QueryParam("quantity") quantity: number
    ) {
        // TODO implement the logic
        return Content("");
    }

    @Delete("/item")
    async deleteItem(
        @QueryParam("id") id: string
    ) {
        // TODO implement the logic
        return Content("");
    }

    @Put("/item/split")
    async splitItem(
        @QueryParam("id") id: string,
        @QueryParam("quantity") quantity: number,
        @Body() billItemIdList: string[]
    ) {
        // TODO implement the logic and return the split bill item list
        return Content("");
    }

    @Put("/item/combine")
    async combineItem(@Body() billItemIdList: string[]) {
        // TODO implement the logic and return the combined bill item list
        return Content("");
    }
}