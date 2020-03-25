export class Table {
  static readonly Status = {
    Free: "Free",
    Using: "Using",
    Reserved: "Reserved",
    Dirty: "Dirty",
    Unavailable: "Unavailable"
  };

  id?: string;

  constructor(
    public name: string,
    public capacity: number,
    public occupied: number = 0,
    public status: string = Table.Status.Unavailable,
    public startTime?: string
  ) {}
}
