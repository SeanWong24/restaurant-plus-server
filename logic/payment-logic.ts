import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { BillLogic } from "./bill-logic.ts";
import { PaymentRepository } from "../repository/payment-repository.ts";
import { Payment } from "../domain-model/payment.ts";

@Injectable()
export class PaymentLogic {
    constructor(private paymentRepository: PaymentRepository, private billLogic: BillLogic) { }

    async get(id?: string, billId?: string) {
        if (id) {
            return await this.paymentRepository.getSingle(id);
        }
        else if (billId) {
            const filter = {
                billId: billId
            }
            return await this.paymentRepository.getMultiple(filter);
        } else {
            return await this.paymentRepository.getMultiple();
        }
    }

    async pay(billId: string, time: string, cashPayAmount: number, cardPayAmount: number, changeGiven: number, billItemIdList: string[]) {
        const newPayment = new Payment(billId, time, cashPayAmount, cardPayAmount, changeGiven);
        const result = await this.paymentRepository.addSingle(newPayment) as any;
        const paymentId = result["$oid"];

        for (const billItemId of billItemIdList) {
            const changeDefinition = {
                paymentId: paymentId
            }
            this.billLogic.modifyBillItem(billItemId, changeDefinition);
        }

        return result;

    }
}
