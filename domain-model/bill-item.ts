export class BillItem {
  id?: string;

  constructor(
    public billId: string,
    public menuItemId: string,
    public quantity: number,
    public groupId: number = 1,
    public paymentId: string = ""
  ) {}
}
