export class Bill {
  static readonly Status = {
    Open: "Open",
    Closed: "Open"
  };

  id?: string;
  billItemIdList: string[] = [];
  paymentIdList: string[] = [];

  constructor(
    public tableId: string,
    public status: string = Bill.Status.Open
  ) {}
}
