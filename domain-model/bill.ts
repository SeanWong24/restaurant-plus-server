export class Bill {
  static readonly Status = {
    Open: "Open",
    Closed: "Open"
  };

  id?: string;
  endTime?: string;

  constructor(
    public tableId: string,
    public startTime: string,
    public status: string = Bill.Status.Open,
    public discountAmount: number = 0,
    public discountPercentage: number = 0
  ) {}
}
