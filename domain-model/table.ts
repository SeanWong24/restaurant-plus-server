export class Table {
  static readonly Status = {
    Available: "Available",
    Unavailable: "Unavailable"
  };

  id: string | undefined;

  constructor(
    public name: string,
    public capacity: number,
    public occupied: number = 0,
    public status: string = Table.Status.Unavailable,
    public startTime?: string
  ) {}
}
