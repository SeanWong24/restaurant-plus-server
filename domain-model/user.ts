export class User {
  id?: string;
  token?: string;
  accessCode? : string;
  facebookId?: string;
  microsoftId?: string;
  googleId?: string;

  constructor(
    public name: string,
    public roleId: string
  ) {}
}
