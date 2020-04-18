export class Bill {
  static readonly Status = {
    Open: "Open",
    Closed: "Closed"
  };

  id?: string;
  endTime?: Date;
  discountId?: string;

  constructor(
    public tableId: string,
    public startTime: Date,
    public status: string = Bill.Status.Open
  ) {}
}
