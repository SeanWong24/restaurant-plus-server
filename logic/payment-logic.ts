import { Injectable } from "../external-modules/alosaur.ts";
import { PaymentRepository } from "../repository/payment-repository.ts";
import { Payment } from "../domain-model/payment.ts";
import { BillItemRepository } from "../repository/bill-item-repository.ts";

@Injectable()
export class PaymentLogic {
    constructor(private paymentRepository: PaymentRepository, private billItemRepository: BillItemRepository) { }

    async get(filter: any) {
        return await this.paymentRepository.find(filter);
    }

    async pay(billId: string, cashPayAmount: number, cardPayAmount: number, changeGiven: number, billItemIdList: string[]) {
        const time = new Date().toISOString();
        const newPayment = new Payment(billId, time, cashPayAmount, cardPayAmount, changeGiven);
        const result = await this.paymentRepository.insert(newPayment) as any;
        const paymentId = result["$oid"];

        for (const billItemId of billItemIdList) {
            const changeDefinition = {
                paymentId: paymentId
            }
            this.billItemRepository.update(billItemId, changeDefinition);
        }

        return result;

    }
}
