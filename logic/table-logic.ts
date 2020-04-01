import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { TableRepository } from "../repository/table-repository.ts";
import { Table } from "../domain-model/table.ts";
import { BillLogic } from "./bill-logic.ts";
import { Bill } from "../domain-model/bill.ts";

@Injectable()
export class TableLogic {
  constructor(private tableRepository: TableRepository, private billLogic: BillLogic) {}

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

  async open(id: string, occupied: number, time: string) {
    if (id && occupied && time) {
      if ((await this.get(id) as Table).status === Table.Status.Free) {
        const tableChangeDefinition = {
          occupied,
          time,
          status: Table.Status.Using
        };
        
        this.billLogic.addBill(id, time);
        return await this.tableRepository.modify(id, tableChangeDefinition) || "";
      }
    }
    return "";
  }

  async reserve(id: string, occupied: number, time: string) {
    if (id && occupied && time) {
      if ((await this.get(id) as Table).status === Table.Status.Free) {
        const changeDefinition = {
          occupied,
          time,
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
    if (table.status === Table.Status.Free) {
      return await this.tableRepository.modify(
        id,
        { status: Table.Status.Unavailable }
      ) || "";
    } else if (table.status === Table.Status.Unavailable) {
      return await this.tableRepository.modify(
        id,
        { status: Table.Status.Free }
      ) || "";
    }
    return "";
  }

  async delete(id: string) {
    if (id) {
      return (await this.tableRepository.delete(id))?.toString() || "";
    }
    return "";
  }

  async close(id: string, time: string) {
    if (id) {
      if ((await this.get(id) as Table).status === Table.Status.Using) {
        const tableChangeDefinition = { 
          status: Table.Status.Dirty,
          occupied: 0,
          time: ""
        };
        
        const filter = {
          tableId: id,
          status: Bill.Status.Open
        };
        const bill = await this.billLogic.getBill(undefined, filter);
        console.log(bill);
        const targetBillId = bill[0].id;
        console.log(targetBillId);
        this.billLogic.closeBill(targetBillId, time);
        return await this.tableRepository.modify(id, tableChangeDefinition) || "";
      }
    }
    return "";
  }

  async free(id: string) {
    if (id) {
      if ((await this.get(id) as Table).status === Table.Status.Dirty) {
        const changeDefinition = { status: Table.Status.Free };
        return await this.tableRepository.modify(id, changeDefinition) || "";
      }
    }
    return "";
  }
}
