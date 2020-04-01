import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { RepoConnection } from "./repoConnection.ts";
import { MenuItem } from "../domain-model/menu-item.ts";
import { Repository } from "./repository.ts";

@Injectable()
export class MenuItemRepository extends Repository<MenuItem> {
  constructor(private repoConnection: RepoConnection) {
    super(repoConnection, "menu-items");
  }
}
