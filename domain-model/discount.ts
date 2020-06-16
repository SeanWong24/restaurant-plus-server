export class Discount {
  static readonly Type = {
    Amount: "amount",
    Percentage: "percentage",
  };
  static readonly Status = {
    Available: "available",
    Unavailable: "unavailable",
  };

  id?: string;
  name?: string;
  type?: string;
  value?: number;
  status: string = Discount.Status.Unavailable;
}
