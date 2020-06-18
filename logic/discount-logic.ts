import { Singleton } from "../deps/alosaur.ts";
import { DiscountRepository } from "../repository/discount-repository.ts";
import { Discount } from "../domain-model/discount.ts";
import { ObjectId } from "../deps/mongo.ts";

@Singleton()
export class DiscountLogic {
  constructor(private discountRepository: DiscountRepository) {}

  async add(name: string, type: string, value: number, status: string) {
    const partialDiscount: Partial<Discount> = {
      name,
      type,
      value,
      status,
    };
    const newDiscount = Object.assign(new Discount(), partialDiscount);
    return await this.discountRepository.insert(newDiscount) || "";
  }

  async get(idList?: string[]) {
    if (idList && idList.length > 0) {
      var objectIdList = idList.map(function (myId) {
        return ObjectId(myId);
      });
      return await this.discountRepository.find(
        { _id: { $in: objectIdList } },
      ) || "";
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

  async toggleAvailability(id: string) {
    const disable = (await this.get([id]))[0] as Discount;
    switch (disable.status) {
      case Discount.Status.Available:
        return await this.disable(id);
      case Discount.Status.Unavailable:
        return await this.free(id);
      default:
        return "";
    }
  }

  async free(id: string) {
    if (id) {
      const disable = (await this.get([id]))[0] as Discount;
      if (disable.status === Discount.Status.Unavailable) {
        const changeDefinition = {
          status: Discount.Status.Available,
        };
        return await this.discountRepository.update(id, changeDefinition) || "";
      }
    }
    return "";
  }

  async disable(id: string) {
    if (id) {
      const disable = (await this.get([id]))[0] as Discount;
      if (disable.status === Discount.Status.Available) {
        const changeDefinition = {
          status: Discount.Status.Unavailable,
        };
        return await this.discountRepository.update(id, changeDefinition) || "";
      }
    }
    return "";
  }
}
