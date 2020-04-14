export class Role {
  static readonly Permission = {
    User_Read: "user.read",
    User_Write: "user.write",
    Role_Read: "role.read"
  }

  id?: string;

  constructor(
    public name: string,
    public permissionList: string[],
    public isDefault: boolean = false,
  ) { }
}
