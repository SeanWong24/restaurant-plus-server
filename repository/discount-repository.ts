import { Injectable } from "../external-modules/alosaur.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { Repository } from "./repository.ts";
import { Discount } from "../domain-model/discount.ts";

@Injectable()
export class DiscountRepository extends Repository<Discount> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "discounts");
  }
}
