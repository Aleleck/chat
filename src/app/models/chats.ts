import { Timestamp } from "firebase/firestore";
import { ProfileUser } from "./user-profile";


export interface Chat {
    id: string;
    lastMessage?: string;
    lastMessageData?: Date & Timestamp;
    userIds: string[];
    users: ProfileUser[];

    chatPic?: string;
    chatName?: string;
}

export interface Message{
    text: string;
    senderId: string;
    sentData: Date | Timestamp;
}