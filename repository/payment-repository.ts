import { Injectable } from "../external-modules/alosaur.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { Repository } from "./repository.ts";
import { Payment } from "../domain-model/payment.ts";

@Injectable()
export class PaymentRepository extends Repository<Payment> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "payments");
  }
}
