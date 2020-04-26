import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { DiscountRepository } from "../repository/discount-repository.ts";
import { Discount } from "../domain-model/discount.ts";

@Injectable()
export class DiscountLogic {
  constructor(private discountRepository: DiscountRepository) { }

  async add(name: string, type: string, amount: number) {
    if (name && type && amount) {
        const newDiscount = new Discount(name, type, amount);
        return await this.discountRepository.insert(newDiscount) || "";
    }
    return "";
  }

  async get(id?: string) {
    if (id) {
    return await this.discountRepository.find({ id });
    } else {
    return await this.discountRepository.find({});
    }
  }

  async modify(id: string, changeDefinition?: any) {
    if (id) {
        return await this.discountRepository.update(id, changeDefinition) || "";
    }
    return "";
  }
}