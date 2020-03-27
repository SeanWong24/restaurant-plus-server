export class User {
  id?: string;

  constructor(
    public name: string,
    public roleId: string,
    public accessCode: string
  ) {}
}
