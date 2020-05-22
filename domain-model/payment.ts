export class Payment {
  id?: string;

  constructor(
    public billId: string,
    public time: string,
    public cashPayAmount: number,
    public cardPayAmount: number,
    public changeGiven: number,
  ) {}
}
