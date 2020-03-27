export class BillItem {
  id?: string;

  constructor(
    public menuItemId: string,
    public quantity: number
  ) {}
}
