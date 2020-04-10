import { Injectable } from "https://raw.githubusercontent.com/SeanWong24/alosaur/cors-builder/src/mod.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { MenuCategory } from "../domain-model/menu-category.ts";
import { Repository } from "./repository.ts";

@Injectable()
export class MenuCategoryRepository extends Repository<MenuCategory> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "menu-categories");
  }
}
