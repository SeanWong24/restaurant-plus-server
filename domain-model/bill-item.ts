export class BillItem {
  id?: string;

  constructor(
    public menuItemId: string,
    public billId: string,
    public quantity: number,
    public paymentId: string
  ) {}
}
