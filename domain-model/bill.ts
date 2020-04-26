export class Bill {
  static readonly Status = {
    Open: "Open",
    Closed: "Closed"
  };

  tableId: string = "";
  status: string = Bill.Status.Open;
  id?: string;
  endTime?: Date;
  discountIdList?: string[];
  startTime?: Date;
}
