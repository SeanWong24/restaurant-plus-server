export class Bill {
  static readonly Status = {
    Open: "Open",
    Closed: "Open"
  };

  id?: string;
  endTime?: string;
  
  billItemIdList: string[] = [];
  paymentIdList: string[] = [];

  constructor(
    public tableId: string,
    public startTime: string,
    public status: string = Bill.Status.Open
  ) { }
}
