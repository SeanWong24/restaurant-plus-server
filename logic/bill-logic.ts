import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { BillRepository } from "../repository/bill-repository.ts";
import { BillItemRepository } from "../repository/bill-item-repository.ts";
import { Bill } from "../domain-model/bill.ts";
import { BillItem } from "../domain-model/bill-item.ts";
@Injectable()
export class BillLogic {
    constructor(
        private billRepository: BillRepository,
        private billItemRepository: BillItemRepository
    ) { }

    async addBill(tableId: string) {
        const startTime = new Date().toISOString();
        const newBill = new Bill(tableId, startTime);
        return await this.billRepository.addSingle(newBill);
    }

    async getBill(id?: string, filter?: any) {
        if (id) {
            return await this.billRepository.getSingle(id);
        } else {
            return await this.billRepository.getMultiple(filter);
        }
    }

    async modifyBill(id: string, changeDefinition: any) {
        if (id) {
            return await this.billRepository.modify(id, changeDefinition) || "";
        }
        return "";
    }

    async closeBill(id: string) {
        const endTime = new Date().toISOString();
        if (id) {
            const result = await this.getBillItem(undefined, id, "false");
            if (Object.keys(result).length == 0) {
                const changeDefinition = {
                    status: Bill.Status.Closed,
                    endTime: endTime
                };
                return await this.billRepository.modify(id, changeDefinition);
            }
        }
        return "";
    }

    async getBillItem(id?: string, billId?: string, hasPaid?: string) {
        if (id) {
            return await this.billItemRepository.getSingle(id);
        } else {
            const filter = {} as any;
            if (billId) {
                filter["billId"] = billId;
            }
            if (hasPaid) {
                if (JSON.parse(hasPaid.toLowerCase())) {
                    filter["paymentId"] = {$ne: ""};
                } else {
                    filter["paymentId"] = "";
                }
            }
            return await this.billItemRepository.getMultiple(filter);
        }
    }

    async addBillItem(billId: string, menuItemId: string, quantity: number, groupId?: number) {
        if (billId && menuItemId && quantity) {
            if (groupId) {
                const newBillItem = new BillItem(billId, menuItemId, quantity, groupId);
                return await this.billItemRepository.addSingle(newBillItem);
            }
        }
        return "";
    }

    async modifyBillItem(id: string, changeDefinition: any) {
        if (id) {
            return await this.billItemRepository.modify(id, changeDefinition) || "";
        }
        return "";
    }

    async deleteBillItem(id: string) {
        if (id) {
            return (await this.billItemRepository.delete(id))?.toString() || "";
        }
        return "";
    }

    async groupBillItem(billItemIdList: string[], groupId: number) {
        if (groupId <= 0) {
            const maxGroupId = await this.billItemRepository.findMaxGroupId(billItemIdList);
            groupId = +maxGroupId + 1;
        }
        const changeDefinition = {
            groupId: groupId
        };
        return await this.billItemRepository.modifyMany(billItemIdList, changeDefinition) || "";
    }

    async splitBillItem(billItemIdList: string[], quantity: number) {
        if (billItemIdList && quantity > 0) {
            billItemIdList.forEach(async id => {
                let oldBillItem = await this.getBillItem(id);
                let newQuantity = oldBillItem.quantity as number / quantity;
                for (let i = 0; i < quantity; i++) {
                    let newBillItem = new BillItem(oldBillItem.billId, oldBillItem.menuItemId, newQuantity);
                    this.billItemRepository.addSingle(newBillItem);
                }
                this.billItemRepository.delete(id);
            });
        }
        return "";
    }

    async combineBillItems(billItemIdList: string[]) {
        if (billItemIdList) {
            const firstBillItem = await this.getBillItem(billItemIdList[0]);
            let menuItemId: string = firstBillItem.menuItemId;
            let totalQuantity: number = 0;
            let billId: string = firstBillItem.billId;

            for (const id of billItemIdList) {
                let oldBillItem = await this.billItemRepository.getSingle(id);
                if (menuItemId != oldBillItem.menuItemId) {
                    return "";
                }
                totalQuantity += +oldBillItem.quantity;
            }
            if (billId != "" && menuItemId != "" && totalQuantity > 0) {
                const finalBillItem = new BillItem(billId, menuItemId, totalQuantity);
                this.billItemRepository.addSingle(finalBillItem);
            }

            billItemIdList.forEach(id => {
                this.billItemRepository.delete(id);
            });
        }
        return "";
    }
}
