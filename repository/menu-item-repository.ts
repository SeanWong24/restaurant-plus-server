import { Injectable } from "https://raw.githubusercontent.com/SeanWong24/alosaur/cors-builder/src/mod.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { MenuItem } from "../domain-model/menu-item.ts";
import { Repository } from "./repository.ts";

@Injectable()
export class MenuItemRepository extends Repository<MenuItem> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "menu-items");
  }
}
