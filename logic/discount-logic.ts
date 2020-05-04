import { Injectable } from "../external-modules/alosaur.ts";
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

  async get(filter?: any) {
    return await this.discountRepository.find(filter) || "";
  }

  async modify(id: string, changeDefinition?: any) {
    if (id) {
        return await this.discountRepository.update(id, changeDefinition) || "";
    }
    return "";
  }
}