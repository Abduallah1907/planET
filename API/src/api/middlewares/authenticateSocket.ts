import config from "@/config";
import { verify } from "jsonwebtoken";
import { Socket } from "socket.io";

// Middleware to authenticate JWT for WebSocket connections
interface AuthenticatedSocket extends Socket {
    user?: any;
}

export const authenticateSocket = (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error('Authentication error'));

    if (!config.jwtSecret) return next(new Error('Authentication error'));
    verify(token, config.jwtSecret, (err: any, user: any) => {
        if (err) return next(new Error('Authentication error'));
        socket.user = user;
        next();
    });
};