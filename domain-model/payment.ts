export class Payment {
  id?: string;

  constructor(
    public billId: string,
    public time: Date,
    public cashPayAmount: number,
    public cardPayAmount: number,
    public changeGiven: number
  ) {}
}
