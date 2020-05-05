export class Bill {
  static readonly Status = {
    Open: "Open",
    Closed: "Closed"
  };

  tableId: string = "";
  status: string = Bill.Status.Open;
  discountIdDict:{[groupId: string]: string[]} = {};
  id?: string;
  endTime?: string;
  startTime?: string;
}
