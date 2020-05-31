import { Injectable } from "../deps/alosaur.ts";
import { BillRepository } from "../repository/bill-repository.ts";
import { BillItemRepository } from "../repository/bill-item-repository.ts";
import { Bill } from "../domain-model/bill.ts";
import { BillItem } from "../domain-model/bill-item.ts";
import { Table } from "../domain-model/table.ts";

@Injectable()
export class BillLogic {
  constructor(
    private billRepository: BillRepository,
    private billItemRepository: BillItemRepository,
  ) {}

  async addBill(tableId: string) {
    const startTime = new Date().toISOString();
    const partialBill: Partial<Bill> = {
      tableId,
      startTime,
    };

    const newBill = Object.assign(new Bill(), partialBill);
    return await this.billRepository.insert(newBill);
  }

  async getBill(filter?: any) {
    return await this.billRepository.find(filter) || "";
  }

  async modify(id?: string, changeDefinition?: Partial<Bill>) {
    if (id) {
      return await this.billRepository.update(id, changeDefinition) || "";
    }
    return "";
  }

  async getTogo() {
    const togoTableList = [];
    const filter = {
      tableId: { $regex: "^[pd][-][0-9]{13}$" },
      status: Bill.Status.Open,
    };
    const togoBillList = await this.getBill(filter) as Bill[];
    let count = 1;
    for (const bill of togoBillList) {
      const togoTable = {
        id: bill.tableId,
        capacity: 1,
        occupied: 1,
        status: Table.Status.Togo,
        name: bill.tableId[0] === "p"
          ? "pickup " + count.toString()
          : "delivery " + count.toString(),
        startTime: bill.startTime,
      };
      togoTableList.push(togoTable);
      count++;
    }
    return togoTableList;
  }

  async addTogo(togoType: string) {
    if (togoType) {
      const startTime = new Date();
      const togoId = togoType + "-" + startTime.getTime().toString();

      const partialBill: Partial<Bill> = {
        tableId: togoId,
        startTime: startTime.toISOString(),
      };
      const togoBill = Object.assign(new Bill(), partialBill);
      return await this.billRepository.insert(togoBill);
    }
  }

  async addDiscountToBill(id: string, discountId: string, groupId?: number) {
    const bill = (await this.getBill({ id }))[0] as Bill;
    if (bill && discountId) {
      if (groupId) {
        const filter = {
          billId: id,
          groupId: groupId,
        };
        const potentialItemList = await this.getBillItem(filter);
        if (potentialItemList.length == 0) {
          return "";
        } else {
          const discountList = bill.discountIdDict[groupId.toString()];
          if (discountList) {
            discountList.push(discountId);
          } else {
            bill.discountIdDict[groupId.toString()] = [discountId];
          }
        }
      }
      return await this.modify(id, { discountIdDict: bill.discountIdDict });
    }
    return "";
  }

  async removeDiscountFromBill(
    id: string,
    discountId: string,
    groupId?: number,
  ) {
    const bill = (await this.getBill({ id }))[0] as Bill;
    if (bill) {
      if (groupId && groupId in bill.discountIdDict) {
        const index = bill.discountIdDict[groupId.toString()].indexOf(
          discountId,
        );
        if (index !== undefined && index >= 0) {
          bill.discountIdDict[groupId.toString()].splice(index, 1);
        }
        return await this.modify(id, { discountIdDict: bill.discountIdDict });
      }
    }
    return "";
  }

  async closeBill(id: string) {
    const endTime = new Date().toISOString();
    const filter = {
      billId: id,
      paymentId: "",
    };
    const result = await this.getBillItem(filter);
    if (result.length == 0) {
      const changeDefinition = {
        status: Bill.Status.Closed,
        endTime: endTime,
      };
      return await this.billRepository.update(id, changeDefinition);
    }
    return "";
  }

  async getBillItem(filter: any) {
    return await this.billItemRepository.find(filter) || "";
  }

  async addBillItem(
    billId: string,
    menuItemId: string,
    quantity: number,
    groupId?: number,
    splitFraction?: number,
  ) {
    const partialBillItem: Partial<BillItem> = {
      billId,
      menuItemId,
      quantity,
      groupId,
      splitFraction,
    };
    const newBillItem = Object.assign(new BillItem(), partialBillItem);

    return await this.billItemRepository.insert(newBillItem) || "";
  }

  async modifyItem(id?: string, changeDefinition?: any) {
    if (id) {
      return await this.billItemRepository.update(id, changeDefinition) || "";
    }
    return "";
  }

  async addDiscountToBillItem(discountId: string, billItemList: string[]) {
    for (const id of billItemList) {
      const billItem = (await this.getBillItem({ id }))[0] as BillItem;
      if (billItem && discountId) {
        billItem.discountIdList.push(discountId);
        await this.modifyItem(
          id,
          { discountIdList: billItem.discountIdList },
        );
      }
    }
    return "";
  }

  async removeDiscountFromBillItem(id?: string, discountId?: string) {
    if (id) {
      const billItem = (await this.getBillItem({ id }))[0] as BillItem;
      if (billItem && discountId) {
        const index = billItem.discountIdList?.indexOf(discountId);
        if (index !== undefined && index >= 0) {
          billItem.discountIdList?.splice(index, 1);
        }
        return await this.modifyItem(
          id,
          { discountIdList: billItem.discountIdList },
        );
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
      const maxGroupId = await this.billItemRepository.findMaxGroupId(
        billItemIdList,
      );
      groupId = +maxGroupId + 1;
    }
    const changeDefinition = {
      groupId: groupId,
    };
    return await this.billItemRepository.update(
      billItemIdList,
      changeDefinition,
    ) || "";
  }

  async splitBillItem(billItemIdList: string[], quantity: number) {
    if (billItemIdList && quantity > 0) {
      billItemIdList.forEach(async (id) => {
        let oldBillItem = (await this.getBillItem({ id }))[0] as BillItem;
        let newQuantity = oldBillItem.quantity as number / quantity;
        for (let i = 0; i < quantity; i++) {
          this.addBillItem(
            oldBillItem.billId,
            oldBillItem.menuItemId,
            newQuantity,
            oldBillItem.groupId,
            oldBillItem.splitFraction / quantity,
          );
        }
        this.billItemRepository.delete(id);
      });
    }
    return "";
  }

  async combineBillItems(billItemIdList: string[]) {
    if (billItemIdList) {
      const firstBillItem =
        (await this.getBillItem({ id: billItemIdList[0] }))[0];
      let menuItemId: string = firstBillItem.menuItemId;
      let totalQuantity: number = 0;
      let billId: string = firstBillItem.billId;
      let totalFraction: number = 0;

      for (const id of billItemIdList) {
        let oldBillItem = (await this.billItemRepository.find({ id }))[0];
        if (menuItemId != oldBillItem.menuItemId) {
          return "";
        }
        totalQuantity += +oldBillItem.quantity;
        totalFraction += +oldBillItem.splitFraction;
      }
      if (billId != "" && menuItemId != "" && totalQuantity > 0) {
        this.addBillItem(
          billId,
          menuItemId,
          totalQuantity,
          firstBillItem.groupId,
          totalFraction,
        );
      }

      billItemIdList.forEach((id) => {
        this.billItemRepository.delete(id);
      });
    }
    return "";
  }
}
