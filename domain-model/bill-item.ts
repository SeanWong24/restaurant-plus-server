export class BillItem {
  id?: string;

  constructor(
    public billId: string,
    public menuItemId: string,
    public quantity: number,
    public paymentId: string = ""
  ) {}
}
