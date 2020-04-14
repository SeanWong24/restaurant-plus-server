export class Discount {
    static readonly type = {
        Amount: "cashAmount",
        Percentage: "percentage"
      };
    id?: string;
  
    constructor(
      public name: string,
      public type: string,
      public amount: number
    ) {}
  }