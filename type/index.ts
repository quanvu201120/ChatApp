import { Timestamp } from "firebase/firestore";

export type Conversation = {
    users: string[]
}

export type AppUser = {
    email: string;
    lastSeen: Timestamp;
    photoURL: string;
    online: boolean;
}

export type Message = {
    id?: string;
    conversationId: string;
    sentAt: string;
    text: string;
    userId: string;
    email: string;
}