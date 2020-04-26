import { Injectable } from "https://deno.land/x/alosaur/src/mod.ts";
import { DiscountRepository } from "../repository/discount-repository.ts";
import { Discount } from "../domain-model/discount.ts";

@Injectable()
export class DiscountLogic {
  constructor(private discountRepository: DiscountRepository) { }

  async add(name: string, type: string, value: number) {
    const partialDiscount: Partial<Discount> = {
      name,
      type,
      value
    };
    const newDiscount = Object.assign(new Discount, partialDiscount);
    return await this.discountRepository.insert(newDiscount) || "";
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