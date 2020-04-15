export class Role {
  static readonly Permission = {
    User_Read: "user.read",
    User_Write: "user.write",
    Role_Read: "role.read",
    Anouncement_Write: "anouncement.write",
    Bill_Read: "bill.read",
    Bill_Write: "bill.write",
    BillItem_Read: "bill_item.read",
    BillItem_Write: "bill_item.write"
  }

  id?: string;

  constructor(
    public name: string,
    public permissionList: string[],
    public isDefault: boolean = false,
  ) { }
}
