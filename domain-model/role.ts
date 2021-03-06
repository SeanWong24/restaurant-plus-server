export class Role {
  static readonly Permission = {
    User_Read: "user.read",
    User_Write: "user.write",
    Role_Read: "role.read",
    Anouncement_Read: "anouncement.read",
    Anouncement_Write: "anouncement.write",
    Bill_Read: "bill.read",
    Bill_Write: "bill.write",
    BillItem_Read: "bill_item.read",
    BillItem_Write: "bill_item.write",
    Table_Read: "table.read",
    Table_Write: "table.write",
    Table_Write_Advanced: "table.write.advanced",
    Menu_Read: "menu.read",
    Menu_Write: "menu.write",
    Discount_Read: "discount.read",
    Discount_Write: "discount.write",
  };

  id?: string;

  constructor(
    public name: string,
    public permissionList: string[],
    public isDefault: boolean = false,
  ) {}
}
