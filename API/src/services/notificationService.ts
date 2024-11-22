import { Service } from "typedi";
import { SocketIOLoader } from "@/loaders/socket";

@Service()
export class NotificationService {
    constructor(private socketIOLoader: SocketIOLoader) {}

    public sendNotification(userId: string, message: string): void {
        const io = this.socketIOLoader.getSocketIO();
        io.to(userId).emit("notification", message);
        console.log(`Notification sent to user ${userId}: ${message}`);
    }
}
