import { compare, genSalt, hash } from "bcrypt";

export class Password {
  static async toHash(password: string): Promise<string> {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  }

  static async validatePassword(
    txtPassword: string,
    hashPassword: string
  ): Promise<boolean> {
    return compare(txtPassword, hashPassword);
  }
}
