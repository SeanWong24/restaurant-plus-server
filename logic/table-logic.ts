import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { TableRepository } from "../repository/table-repository.ts";
import { Table } from "../domain-model/table.ts";
import { BillLogic } from "./bill-logic.ts";
import { Bill } from "../domain-model/bill.ts";

@Injectable()
export class TableLogic {
  constructor(private tableRepository: TableRepository, private billLogic: BillLogic) { }

  async add(name: string, capacity: number) {
    const newTable = new Table(name, capacity);
    return await this.tableRepository.addSingle(newTable);
  }

  async get(id?: string) {
    if (id) {
      return await this.tableRepository.getSingle(id);
    } else {
      return await this.tableRepository.getMultiple();
    }
  }

  async open(id: string, occupied: number) {
    const time = new Date().toISOString();
    if (id && occupied) {
      const table = await this.get(id) as Table;
      if (table.status === Table.Status.Free || table.status === Table.Status.Reserved) {
        const tableChangeDefinition = {
          occupied,
          startTime: time,
          status: Table.Status.Using
        };

        this.billLogic.addBill(id);
        return await this.tableRepository.modify(id, tableChangeDefinition) || "";
      }
    }
    return "";
  }

  async reserve(id: string, occupied: number) {
    const time = new Date().toISOString();
    if (id && occupied) {
      if ((await this.get(id) as Table).status === Table.Status.Free) {
        const changeDefinition = {
          occupied,
          startTime: time,
          status: Table.Status.Reserved
        };
        return await this.tableRepository.modify(id, changeDefinition) || "";
      }
    }
    return "";
  }

  async modify(id: string, changeDefinition: any) {
    if (id) {
      return await this.tableRepository.modify(id, changeDefinition) || "";
    }
    return "";
  }

  async toggleAvailability(id: string) {
    const table = await this.get(id) as Table;
    switch (table.status) {
      case Table.Status.Free:
        return await this.disable(id);
      case Table.Status.Unavailable:
        return await this.free(id);
      default:
        return "";
    }
  }

  async delete(id: string) {
    if (id) {
      const respone = await this.billLogic.getBill(undefined, id) as Bill;
      if (Object.keys(respone).length == 0) {
          return (await this.tableRepository.delete(id))?.toString() || "";
      }
    }
    return "";
  }

  async close(id: string) {
    if (id) {
      if ((await this.get(id) as Table).status === Table.Status.Using) {
        const bill = await this.billLogic.getBill(undefined, id, Bill.Status.Open);
        const targetBillId = bill[0].id;
        const closeBillResult = await this.billLogic.closeBill(targetBillId);
        if (closeBillResult != "") {
          const tableChangeDefinition = {
            status: Table.Status.Dirty,
            occupied: 0,
            time: ""
          };
          return await this.tableRepository.modify(id, tableChangeDefinition) || "";
        }
      }
    }
    return "";
  }

  async free(id: string) {
    if (id) {
      const table = await this.get(id) as Table;
      if (
        table.status === Table.Status.Dirty ||
        table.status === Table.Status.Reserved ||
        table.status === Table.Status.Unavailable
      ) {
        const changeDefinition = {
          status: Table.Status.Free,
          occupied: 0,
          startTime: ""
        };
        return await this.tableRepository.modify(id, changeDefinition) || "";
      }
    }
    return "";
  }

  async disable(id: string) {
    if (id) {
      const table = await this.get(id) as Table;
      if (
        table.status === Table.Status.Dirty ||
        table.status === Table.Status.Reserved ||
        table.status === Table.Status.Free
      ) {
        const changeDefinition = {
          status: Table.Status.Unavailable,
          occupied: 0,
          startTime: ""
        };
        return await this.tableRepository.modify(id, changeDefinition) || "";
      }
    }
    return "";
  }
}
