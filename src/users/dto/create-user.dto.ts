export class CreateUserDto {
  username: string;

  email: string;

  password: string;

  firstName: string;

  lastName: string;

  role: string; // this should be admin or user

  photo: string; // how to upload?
}
