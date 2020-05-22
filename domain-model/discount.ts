export class Discount {
  static readonly type = {
    Amount: "amount",
    Percentage: "percentage",
  };

  id?: string;
  name?: string;
  type?: string;
  value?: number;
}
