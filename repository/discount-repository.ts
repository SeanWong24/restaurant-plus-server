import { Singleton } from "../deps/alosaur.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { Repository } from "./repository.ts";
import { Discount } from "../domain-model/discount.ts";

@Singleton()
export class DiscountRepository extends Repository<Discount> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "discounts");
  }
}
