import { Injectable } from "https://raw.githubusercontent.com/SeanWong24/alosaur/cors-builder/src/mod.ts";
import { RepositoryConnection } from "./repository-connection.ts";
import { Repository } from "./repository.ts";
import { Payment } from "../domain-model/payment.ts";

@Injectable()
export class PaymentRepository extends Repository<Payment> {
  constructor(private repoConnection: RepositoryConnection) {
    super(repoConnection, "payments");
  }
}