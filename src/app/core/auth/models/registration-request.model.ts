export class RegistrationRequest {
  username: string;
  password: string;

  constructor(username: string, passsword: string) {
    this.username = username;
    this.password = passsword;
  }
}
