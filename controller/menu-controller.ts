import {
    Controller,
    Content,
    QueryParam,
    Get,
    Post,
    Put
} from "https://deno.land/x/alosaur/src/mod.ts";
import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";

@Injectable()
@Controller("/menu")
export class MenuController {
    constructor() { }

    @Get("/category")
    async getCategory(@QueryParam("id") id: string) {
        // TODO implement the logic and return the category or category list
        return Content("");
    }

    @Post("/category/add")
    async addCategory(@QueryParam("name") name: string) {
        // TODO implement the logic
        return Content("");
    }

    @Put("/category/modify")
    async modifyCategory(@QueryParam("id") id: string, @QueryParam("name") name: string) {
        // TODO implement the logic
        return Content("");
    }


    @Get("/item")
    async getItem(@QueryParam("id") id: string) {
        // TODO implement the logic and return the menu item or menu item list
        return Content("");
    }

    @Post("/item/add")
    async addItem(
        @QueryParam("name") name: string,
        @QueryParam("shortName") shortName: string,
        @QueryParam("unitPrice") unitPrice: number,
        @QueryParam("status") status: string,
        @QueryParam("category") category: string,
        @QueryParam("gstRate") gstRate: number,
        @QueryParam("pstRate") pstRate: number,
        @QueryParam("lctRate") lctRate: number,
    ) {
        // TODO implement the logic
        return Content("");
    }

    @Post("/item/modify")
    async modifyItem(
        @QueryParam("id") id: string,
        @QueryParam("name") name: string,
        @QueryParam("shortName") shortName: string,
        @QueryParam("unitPrice") unitPrice: number,
        @QueryParam("status") status: string,
        @QueryParam("category") category: string,
        @QueryParam("gstRate") gstRate: number,
        @QueryParam("pstRate") pstRate: number,
        @QueryParam("lctRate") lctRate: number,
    ) {
        // TODO implement the logic
        return Content("");
    }
}