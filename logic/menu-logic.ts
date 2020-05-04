import { Injectable } from "../external-modules/alosaur.ts";
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
    categoryId: string,
    status?: string,
    gstRate?: number,
    pstRate?: number,
    lctRate?: number,
    imageUrl?: string
  ) {
    const partialMenuItem: Partial<MenuItem> = {
      name,
      shortName,
      unitPrice,
      categoryId,
      status,
      gstRate,
      pstRate,
      lctRate,
      imageUrl
    };
    const newMenuItem = Object.assign(new MenuItem, partialMenuItem);
    return await this.menuItemRepository.insert(newMenuItem) || "";
  }

  async getMenuItem(filter?: any) {
    return await this.menuItemRepository.find(filter) || "";
  }

  async modifyItem(id: string, changeDefinition: any) {
    if (id) {
      if ("unitPrice" in changeDefinition && this.isItemUsed(id)) {
        delete changeDefinition["unitPrice"];
      }
      return await this.menuItemRepository.update(id, changeDefinition) || "";
    }
    return "";
  }

  async addMenuCategory(name: string) {
    const partialMenuCategory: Partial<MenuCategory> = {name};
    const newMenuCategory = Object.assign(new MenuCategory, partialMenuCategory);
    return await this.menuCategoryRepository.insert(newMenuCategory);
  }

  async getMenuCategory(filter: any) {
    return await this.menuCategoryRepository.find(filter);
  }

  async modifyCategory(id: string, changeDefinition: any) {
    if (id) {
      return await this.menuCategoryRepository.update(id, changeDefinition) ||
        "";
    }
    return "";
  }

  private isItemUsed(id: string) {
    //TODO: check if the menu item has been used
    return true;
  }
}
