import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.4.0/ts/types.ts";
import { RepoConnection } from "./repoConnection.ts";
import { MenuItem } from "../domain-model/menu-item.ts";

@Injectable()
export class MenuItemRepository {
  readonly CollectionName = "menu-items";

  get collection() {
    return this.repository.database?.collection(this.CollectionName);
  }

  constructor(private repository: RepoConnection) {}

  async addSingle(menuItem: MenuItem) {
    return await this.collection?.insertOne(menuItem);
  }

  async getSingle(id: string) {
    return this.getMenuItemInstanceWithId(
      await this.collection?.findOne({ _id: ObjectId(id) }) as MenuItem
    );
  }

  async getAll() {
    const menuItemList = await this.collection?.find() as MenuItem[];
    return menuItemList?.map(menuItem =>
      this.getMenuItemInstanceWithId(menuItem)
    );
  }

  async modify(id: string, changDefinition: any) {
    return await this.collection?.updateOne(
      { _id: ObjectId(id) },
      { $set: changDefinition }
    );
  }

  private getMenuItemInstanceWithId(menuItem: MenuItem) {
    menuItem.id = (menuItem as any)._id.$oid;
    return menuItem;
  }
}
