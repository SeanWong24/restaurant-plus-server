export class User {
  id?: string;

  constructor(
    public name: string,
    public role: string,
    public accessCode: string
  ) {}
}
