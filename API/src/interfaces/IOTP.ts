import { Document } from "mongoose";

interface IOTP extends Document {
    user_id: string;
    code: string;
    expiresAt: Date;
    createdAt: Date;
}

export default IOTP;