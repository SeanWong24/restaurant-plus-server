import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { RepoConnection } from "./repoConnection.ts";
import { MenuCategory } from "../domain-model/menu-category.ts";
import { Repository } from "./repository.ts";

@Injectable()
export class MenuCategoryRepository extends Repository<MenuCategory> {
  constructor(private repoConnection: RepoConnection) {
    super(repoConnection, "menu-categories");
  }
}
