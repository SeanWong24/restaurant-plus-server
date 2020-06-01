import { Singleton } from "../deps/alosaur.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { MenuCategory } from "../domain-model/menu-category.ts";
import { Repository } from "./repository.ts";

@Singleton()
export class MenuCategoryRepository extends Repository<MenuCategory> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "menu-categories");
  }
}
