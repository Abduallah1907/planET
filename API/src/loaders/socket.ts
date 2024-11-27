import { Service } from "typedi";
import { Server } from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { authenticateSocket } from "@/api/middlewares/authenticateSocket"; // Adjust the import path as necessary

interface AuthenticatedSocket extends Socket {
    user?: any;
}

@Service() // Register the class in typedi's container
export class SocketIOLoader {
    private io: SocketIOServer | null = null;

    // Initialize the Socket.IO server
    public initialize(httpServer: Server): void {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: "*", // Allow all origins
            },
        });

        this.io.use(authenticateSocket);

        this.io.on("connection", (socket: AuthenticatedSocket) => {
            console.log(`New client connected: ${socket.id}`);

            socket.on("disconnect", () => {
                console.log(`Client disconnected: ${socket.id}`);
            });

            // Extract userId from socket authentication and join a room
            const userId = socket.user?.userId;

            if (userId) {
                // Join the user to a room with their userId
                socket.join(userId);
            }

            // Add your custom event handlers here
            socket.on("message", (data) => {
                console.log(`Message received: ${data}`);
                this.io?.emit("message", data);
            });
        });
    }

    // Getter for the io instance
    public getSocketIO(): SocketIOServer {
        if (!this.io) {
            throw new Error("Socket.IO server is not initialized. Call initialize() first.");
        }
        return this.io;
    }
}
