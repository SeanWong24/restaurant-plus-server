import { Injectable } from "../external-modules/alosaur.ts";
import { DiscountRepository } from "../repository/discount-repository.ts";
import { Discount } from "../domain-model/discount.ts";
import { ObjectId } from "../external-modules/mongo-types.ts";

@Injectable()
export class DiscountLogic {
  constructor(private discountRepository: DiscountRepository) { }

  async add(name: string, type: string, value: number) {
    const partialDiscount: Partial<Discount> = {
      name,
      type,
      value,
    };
    const newDiscount = Object.assign(new Discount(), partialDiscount);
    return await this.discountRepository.insert(newDiscount) || "";
  }

  async get(idList?: string[]) {
    if (idList && idList.length > 0) {
      console.log(idList);
      var objectIdList = idList.map(function (myId) { return ObjectId(myId); });
      return await this.discountRepository.find({ _id: { $in: objectIdList } }) || "";
    } else {
      return await this.discountRepository.find({}) || "";
    }
  }

  async modify(id: string, changeDefinition?: any) {
    if (id) {
      return await this.discountRepository.update(id, changeDefinition) || "";
    }
    return "";
  }
}
