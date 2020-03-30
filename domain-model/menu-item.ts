export class MenuItem {
  static readonly Status = {
    Available: "Available",
    Unavailable: "Unavailable"
  };

  id?: string;

  constructor(
    public name: string,
    public shortName: string,
    public unitPrice: number,
    public categoryId: string,
    public status: string = MenuItem.Status.Unavailable,
    public gstRate: number = 0,
    public pstRate: number = 0,
    public lctRate: number = 0,
    public imageUrl: string = ""
  ) { }
}
