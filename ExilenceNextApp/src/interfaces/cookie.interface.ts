export interface ICookie {
  url: string;
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  expirationDate?: number;
  sameSite: string;
}
