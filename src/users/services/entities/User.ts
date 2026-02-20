export default interface User {
  firstName: string;
  lastName: string;
  email: string;
  password_Hash: string;
  role?: string;
  birthDate: Date;
}
