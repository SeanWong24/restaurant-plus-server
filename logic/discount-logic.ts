import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { DiscountRepository } from "../repository/discount-repository.ts";
import { Discount } from "../domain-model/discount.ts";

@Injectable()
export class DiscountLogic {
  constructor(private discountRepository: DiscountRepository) { }

  async add(name: string, type: string, amount: number) {
    if (name && type && amount) {
        const newDiscount = new Discount(name, type, amount);
        return await this.discountRepository.addSingle(newDiscount) || "";
    }
    return "";
  }

  async get(id?: string) {
    if (id) {
    return await this.discountRepository.getSingle(id);
    } else {
    return await this.discountRepository.getMultiple();
    }
  }

  async modify(id: string, name?: string, type?: string, amount?: number) {
    if (id) {
        const changeDefinition = {} as any;
        if (name) {
            changeDefinition["name"] = name;
        }
        if (type) {
            changeDefinition["type"] = type;
        }
        if (amount) {
            changeDefinition["amount"] = amount;
        }
        return await this.discountRepository.modify(id, changeDefinition) || "";
    }
    return "";
  }
}