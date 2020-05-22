export class User {
  id?: string;
  token?: string;

  constructor(
    public name: string,
    public roleId: string,
    public accessCode: string,
  ) {}
}
