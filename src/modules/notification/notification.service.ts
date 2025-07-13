import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
  async send() {
    // Logic to send notifications
    console.log("Notification sent");
  }
}
