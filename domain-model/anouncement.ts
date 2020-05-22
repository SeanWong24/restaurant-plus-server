export class Anouncement {
  id?: string;

  constructor(
    public title: string,
    public content: string,
    public timeCreated: string,
  ) {}
}
