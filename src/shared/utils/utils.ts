import * as bcrypt from 'bcrypt';
export class Utils {
  public static generateHash(str: string): string {
    return bcrypt.hashSync(str, parseInt(process.env.BCRYPT_WORK));
  }

  public static trimLowerString(str: string): string {
    return str.trim().toLowerCase();
  }

  public static generateOTP(otpExpiryTime: string): { otp: string; otpExpiry: Date } {
    // Generate a random 4-digit number
    const otp = Math.floor(1000 + Math.random() * 9000);
    const currentTime = new Date();
    const otpExpiry = new Date(currentTime.getTime() + parseInt(otpExpiryTime) * 60000);
    return { otp: otp.toString(), otpExpiry }; // Convert to string before returning
  }

  public static verifyPassword(userPassword: string, passwordInput: string): boolean {
    return bcrypt.compareSync(passwordInput, userPassword);
  }
}
