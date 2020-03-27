import {
    Controller,
    Content,
    QueryParam,
    Get,
    Post,
    Put
} from "https://deno.land/x/alosaur/src/mod.ts";
import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { MenuLogic } from "../logic/menu-logic.ts";

@Injectable()
@Controller("/menu")
export class MenuController {
    constructor(private menuLogic: MenuLogic) { }

    @Get("/category")
    async getCategory(@QueryParam("id") id: string) {
        return Content(await this.menuLogic.getMenuCategory(id));
    }

    @Post("/category/add")
    async addCategory(@QueryParam("name") name: string) {
        return Content(await this.menuLogic.addMenuCategory(name));
    }

    @Put("/category/modify")
    async modifyCategory(@QueryParam("id") id: string, @QueryParam("name") name: string) {
        const changeDefinition = {} as any;
        if (name) {
            changeDefinition["name"] = name;
        }
        return Content(await this.menuLogic.modifyMenuCategory(id, changeDefinition));
    }


    @Get("/item")
    async getItem(@QueryParam("id") id: string) {
        return Content(await this.menuLogic.getMenuItem(id));
    }

    @Post("/item/add")
    async addItem(
        @QueryParam("name") name: string,
        @QueryParam("shortName") shortName: string,
        @QueryParam("unitPrice") unitPrice: number,
        @QueryParam("status") status: string,
        @QueryParam("categoryId") categoryId: string,
        @QueryParam("gstRate") gstRate: number,
        @QueryParam("pstRate") pstRate: number,
        @QueryParam("lctRate") lctRate: number
    ) {
        return Content(await this.menuLogic.addMenuItem(name, shortName, unitPrice, status, categoryId, gstRate, pstRate, lctRate));
    }

    @Post("/item/modify")
    async modifyItem(
        @QueryParam("id") id: string,
        @QueryParam("name") name: string,
        @QueryParam("shortName") shortName: string,
        @QueryParam("unitPrice") unitPrice: number,
        @QueryParam("status") status: string,
        @QueryParam("categoryId") categoryId: string,
        @QueryParam("gstRate") gstRate: number,
        @QueryParam("pstRate") pstRate: number,
        @QueryParam("lctRate") lctRate: number
    ) {
        const changeDefinition = {} as any;
        if (id) {
            if (name) {
                changeDefinition["name"] = name;
            }
            if (shortName) {
                changeDefinition["shortName"] = shortName;
            }
            if (unitPrice) {
                changeDefinition["unitPrice"] = unitPrice;
            }
            if (status) {
                changeDefinition["status"] = status;
            }
            if (categoryId) {
                changeDefinition["categoryId"] = categoryId;
            }
            if (gstRate) {
                changeDefinition["gstRate"] = gstRate;
            }
            if (pstRate) {
                changeDefinition["pstRate"] = pstRate;
            }
            if (lctRate) {
                changeDefinition["lctRate"] = lctRate;
            }
        }
        return Content(await this.menuLogic.modifyMenuItem(id, changeDefinition));
    }
}