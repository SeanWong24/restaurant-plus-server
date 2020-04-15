export class Discount {
    static readonly type = {
        Amount: "amount",
        Percentage: "percentage"
      };
    id?: string;
  
    constructor(
      public name: string,
      public type: string,
      public value: number
    ) {}
  }