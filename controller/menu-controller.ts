import {
  Controller,
  Content,
  QueryParam,
  Get,
  Post,
  Put,
  Singleton,
  UseHook,
} from "../deps/alosaur.ts";
import { MenuLogic } from "../logic/menu-logic.ts";
import { LogHook } from "../utilities/log-hook.ts";

@Singleton()
@UseHook(LogHook)
@Controller("/menu")
export class MenuController {
  constructor(private menuLogic: MenuLogic) {}

  @Get("/category")
  async getCategory(@QueryParam("id") id: string) {
    return Content(await this.menuLogic.getMenuCategory({ id }));
  }

  @Post("/category/add")
  async addCategory(@QueryParam("name") name: string) {
    return Content(await this.menuLogic.addMenuCategory(name));
  }

  @Put("/category/modify")
  async modifyCategory(
    @QueryParam("id") id: string,
    @QueryParam("name") name: string,
  ) {
    const changeDefinition = {} as any;
    if (name) {
      changeDefinition["name"] = name;
    }
    return Content(await this.menuLogic.modifyCategory(id, changeDefinition));
  }

  @Get("/item")
  async getItem(@QueryParam("id") id: string) {
    return Content(await this.menuLogic.getMenuItem({ id }));
  }

  @Post("/item/add")
  async addItem(
    @QueryParam("name") name: string,
    @QueryParam("shortName") shortName: string,
    @QueryParam("unitPrice") unitPrice: number,
    @QueryParam("categoryId") categoryId: string,
    @QueryParam("status") status: string,
    @QueryParam("gstRate") gstRate: number,
    @QueryParam("pstRate") pstRate: number,
    @QueryParam("lctRate") lctRate: number,
    @QueryParam("imageUrl") imageUrl: string,
  ) {
    return Content(
      await this.menuLogic.addMenuItem(
        name,
        shortName,
        unitPrice,
        categoryId,
        status,
        gstRate,
        pstRate,
        lctRate,
        imageUrl,
      ),
    );
  }

  @Put("/item/modify")
  async modifyItem(
    @QueryParam("id") id: string,
    @QueryParam("name") name: string,
    @QueryParam("shortName") shortName: string,
    @QueryParam("unitPrice") unitPrice: number,
    @QueryParam("status") status: string,
    @QueryParam("categoryId") categoryId: string,
    @QueryParam("gstRate") gstRate: number,
    @QueryParam("pstRate") pstRate: number,
    @QueryParam("lctRate") lctRate: number,
    @QueryParam("imageUrl") imageUrl: string,
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
      if (imageUrl) {
        changeDefinition["imageUrl"] = (imageUrl === "(null)") ? "" : imageUrl;
      }
    }
    return Content(await this.menuLogic.modifyItem(id, changeDefinition));
  }
}
