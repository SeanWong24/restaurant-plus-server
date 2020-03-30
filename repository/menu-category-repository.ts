import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.4.0/ts/types.ts";
import { Repository } from "./repository.ts";
import { MenuCategory } from "../domain-model/menu-category.ts";

@Injectable()
export class MenuCategoryRepository {
  readonly CollectionName = "menu-categories";

  get collection() {
    return this.repository.database?.collection(this.CollectionName);
  }

  constructor(private repository: Repository) {}

  async addSingle(menuCategory: MenuCategory) {
    return await this.collection?.insertOne(menuCategory);
  }

  async getSingle(id: string) {
    return this.getMenuCategoryInstanceWithId(
      await this.collection?.findOne({ _id: ObjectId(id) }) as MenuCategory
    );
  }

  async getAll() {
    const menuCategoryList = await this.collection?.find() as MenuCategory[];
    return menuCategoryList?.map(menuCategory =>
      this.getMenuCategoryInstanceWithId(menuCategory)
    );
  }

  async modify(id: string, changDefinition: any) {
    return await this.collection?.updateOne(
      { _id: ObjectId(id) },
      { $set: changDefinition }
    );
  }

  private getMenuCategoryInstanceWithId(menuCategory: MenuCategory) {
    menuCategory.id = (menuCategory as any)._id.$oid;
    return menuCategory;
  }
}
