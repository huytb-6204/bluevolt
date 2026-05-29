import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import twilio from "twilio";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly client: ReturnType<typeof twilio>;
  private readonly serviceSid: string;

  constructor(private readonly config: ConfigService) {
    const accountSid = this.config.getOrThrow<string>("TWILIO_ACCOUNT_SID");
    const authToken = this.config.getOrThrow<string>("TWILIO_AUTH_TOKEN");
    this.serviceSid = this.config.getOrThrow<string>("TWILIO_VERIFY_SERVICE_SID");
    this.client = twilio(accountSid, authToken);
  }

  async sendOtp(phone: string): Promise<void> {
    await this.client.verify.v2
      .services(this.serviceSid)
      .verifications.create({ to: phone, channel: "sms" });
    this.logger.log(`OTP sent to ${phone}`);
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const result = await this.client.verify.v2
      .services(this.serviceSid)
      .verificationChecks.create({ to: phone, code });
    return result.status === "approved";
  }
}
