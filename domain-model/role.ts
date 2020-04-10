export class Role {
  static readonly AccessItem = {
    User_Read: "user.read",
    User_Write: "user.write",
    Role_Read: "role.read"
  }

  id?: string;

  constructor(
    public name: string,
    public accessList: string[],
    public isDefault: boolean = false,
  ) { }
}
