import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { MenuItem } from "../domain-model/menu-item.ts";
import { MenuItemRepository } from "../repository/menu-item-repository.ts";
import {
  MenuCategoryRepository
} from "../repository/menu-category-repository.ts";
import { MenuCategory } from "../domain-model/menu-category.ts";

@Injectable()
export class MenuLogic {
  constructor(
    private menuItemRepository: MenuItemRepository,
    private menuCategoryRepository: MenuCategoryRepository
  ) {}

  async addMenuItem(
    name: string,
    shortName: string,
    unitPrice: number,
    status: string,
    categoryId: string,
    gstRate: number,
    pstRate: number,
    lctRate: number
  ) {
    const newMenuItem = new MenuItem(
      name,
      shortName,
      unitPrice,
      status,
      categoryId,
      gstRate,
      pstRate,
      lctRate
    );
    return await this.menuItemRepository.addSingle(newMenuItem);
  }

  async getMenuItem(id?: string) {
    if (id) {
      return await this.menuItemRepository.getSingle(id);
    } else {
      return await this.menuItemRepository.getAll();
    }
  }

  async modifyMenuItem(id: string, changeDefinition: any) {
    if (id) {
      if ("unitPrice" in changeDefinition && this.isItemUsed(id)) {
        delete changeDefinition["unitPrice"];
      }
      return await this.menuItemRepository.modify(id, changeDefinition) || "";
    }
    return "";
  }

  async addMenuCategory(name: string) {
    const newMenuCategory = new MenuCategory(name);
    return await this.menuCategoryRepository.addSingle(newMenuCategory);
  }

  async getMenuCategory(id?: string) {
    if (id) {
      return await this.menuCategoryRepository.getSingle(id);
    } else {
      return await this.menuCategoryRepository.getAll();
    }
  }

  async modifyMenuCategory(id: string, changeDefinition: any) {
    if (id) {
      return await this.menuCategoryRepository.modify(id, changeDefinition) ||
        "";
    }
    return "";
  }

  private isItemUsed(id: string) {
    //TODO: check if the menu item has been used
    return true;
  }
}
