import { Service, Inject } from "typedi";
import { IUser } from "@/interfaces/IUser";
import config from "@/config";
import bcrypt from "bcrypt";

@Service()
export default class MailerService {
  @Inject("emailTransporter") private emailTransporter: any;

  public async SendWelcomeEmail(email: string) {
    /**
     * @TODO Call Mailchimp/Sendgrid or whatever
     */
    // Added example for sending mail from mailgun
    const data = {
      from: config.emails.user,
      to: [email],
      subject: "Hello",
      text: "Testing some Mailgun awesomness!",
    };
    try {
      this.emailTransporter.sendMail(data);
      return { delivered: 1, status: "ok" };
    } catch (e) {
      return { delivered: 0, status: "error" };
    }
  }
  public StartEmailSequence(sequence: string, user: Partial<IUser>) {
    if (!user.email) {
      throw new Error("No email provided");
    }
    // @TODO Add example of an email sequence implementation
    // Something like
    // 1 - Send first email of the sequence
    // 2 - Save the step of the sequence in database
    // 3 - Schedule job for second email in 1-3 days or whatever
    // Every sequence can have its own behavior so maybe
    // the pattern Chain of Responsibility can help here.
    return { delivered: 1, status: "ok" };
  }

  public async SendPasswordReminderEmail(user: Partial<IUser>) {
    if (!user.email) {
      throw new Error("Email not provided");
    }
    if (!user.password) {
      throw new Error("Password not provided");
    }

    // Dehash the password
    const saltRounds = 10;
    const decryptedPassword = await bcrypt.hash(user.password, saltRounds);

    const data = {
      from: config.emails.user,
      to: [user.email],
      subject: "Password Reminder",
      text: `Your old password is: ${decryptedPassword}`,
    };

    try {
      this.emailTransporter.sendMail(data);
      return { delivered: 1, status: "ok" };
    } catch (e) {
      return { delivered: 0, status: "error" };
    }
  }

  public async SendPasswordOTPEmail(user: Partial<IUser>) {
    if (!user.email) {
      throw new Error("Email not provided");
    }
    if (!user.password) {
      throw new Error("Password not provided");
    }

    // Dehash the password
    const saltRounds = 10;
    const decryptedPassword = await bcrypt.hash(user.password, saltRounds);

    const data = {
      from: config.emails.user,
      to: [user.email],
      subject: "Password Reminder",
      text: `Your old password is: ${decryptedPassword}`,
    };

    try {
      this.emailTransporter.sendMail(data);
      return { delivered: 1, status: "ok" };
    } catch (e) {
      return { delivered: 0, status: "error" };
    }
  }

  public async sendOTPMail(email: string, otp: string) {
    const data = {
      from: config.emails.user,
      to: [email],
      subject: "Password reset OTP",
      text: `Your OTP is: ${otp}\nThis OTP is valid for 10 minutes.`,
    };

    try {
      this.emailTransporter.sendMail(data);
      return { delivered: 1, status: "ok" };
    } catch (e) {
      return { delivered: 0, status: "error" };
    }
  }
}
