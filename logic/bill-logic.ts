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
        const partialBill: Partial<Bill> = {
            tableId,
            startTime
        };

        const newBill = Object.assign(new Bill, partialBill);
        return await this.billRepository.insert(newBill);
    }

    async getBill(filter?: any) {
        return await this.billRepository.find(filter) || '';
    }

    async modify(id?: string, changeDefinition?: Partial<Bill>) {
        if (id) {
            return await this.billItemRepository.update(id, changeDefinition) || "";
        }
        return "";
    }

    async addDiscountToBill(id?: string, discountId?: string) {
        if (id) {
            const bill = (await this.getBill(id))[0] as Bill;
            if (bill && discountId){
                bill.discountIdList?.push(discountId);
                this.modify(id ,{discountIdList: bill.discountIdList});
            }
        }
        return "";
    }

    async closeBill(id: string) {
        const endTime = new Date().toISOString();
        if (id) {
            const result = await this.getBillItem(undefined, id, "false");
            if (result.length == 0) {
                const changeDefinition = {
                    status: Bill.Status.Closed,
                    endTime: endTime
                };
                return await this.billRepository.update(id, changeDefinition);
            }
        }
        return "";
    }

    async getBillItem(id?: string, billId?: string, hasPaid?: string) {
        if (id) {
            return await this.billItemRepository.find({ id });
        } else {
            const filter = {} as any;
            if (billId) {
                filter["billId"] = billId;
            }
            if (hasPaid) {
                if (JSON.parse(hasPaid.toLowerCase())) {
                    filter["paymentId"] = { $ne: "" };
                } else {
                    filter["paymentId"] = "";
                }
            }
            return await this.billItemRepository.find(filter);
        }
    }

    async addBillItem(billId: string, menuItemId: string, quantity: number, groupId?: number) {
        const partialBillItem: Partial<BillItem> = {
            billId,
            menuItemId,
            quantity,
            groupId
        };
        const newBillItem = Object.assign(new BillItem, partialBillItem);

        return await this.billItemRepository.insert(newBillItem) || "";
    }

    async modifyItem(id?: string, changeDefinition?: any) {
        if (id) {
            return await this.billItemRepository.update(id, changeDefinition) || "";
        }
        return "";
    }

    async addDiscountToBillItem(id?: string, discountId?: string) {
        if (id) {
            const billItem = (await this.getBillItem(id))[0] as BillItem;
            if (billItem && discountId){
                billItem.discountIdList?.push(discountId);
                this.modify(id ,{discountIdList: billItem.discountIdList});
            }
        }
        return "";
    }

    async deleteBillItem(idList: string[]) {
        if (idList) {
            return (await this.billItemRepository.delete(idList))?.toString() || "";
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
        return await this.billItemRepository.update(billItemIdList, changeDefinition) || "";
    }

    async splitBillItem(billItemIdList: string[], quantity: number) {
        if (billItemIdList && quantity > 0) {
            billItemIdList.forEach(async id => {
                let oldBillItem = (await this.getBillItem(id))[0];
                let newQuantity = oldBillItem.quantity as number / quantity;
                for (let i = 0; i < quantity; i++) {
                    this.addBillItem(oldBillItem.billId, oldBillItem.menuItemId, newQuantity);
                }
                this.billItemRepository.delete(id);
            });
        }
        return "";
    }

    async combineBillItems(billItemIdList: string[]) {
        if (billItemIdList) {
            const firstBillItem = (await this.getBillItem(billItemIdList[0]))[0];
            let menuItemId: string = firstBillItem.menuItemId;
            let totalQuantity: number = 0;
            let billId: string = firstBillItem.billId;

            for (const id of billItemIdList) {
                let oldBillItem = (await this.billItemRepository.find(id))[0];
                if (menuItemId != oldBillItem.menuItemId) {
                    return "";
                }
                totalQuantity += +oldBillItem.quantity;
            }
            if (billId != "" && menuItemId != "" && totalQuantity > 0) {
                this.addBillItem(billId, menuItemId, totalQuantity);
            }

            billItemIdList.forEach(id => {
                this.billItemRepository.delete(id);
            });
        }
        return "";
    }
}
