export class Table {
  static readonly Status = {
    Free: "Free",
    Using: "Using",
    Reserved: "Reserved",
    Dirty: "Dirty",
    Unavailable: "Unavailable"
  };

  id?: string;
  name: string = '';
  capacity: number = 2;
  occupied: number = 0;
  status: string = Table.Status.Unavailable;
  startTime?: Date;
}
