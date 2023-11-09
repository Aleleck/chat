import { ProfileUser } from "./user";


export interface Chat {
    id: string;
    lastMessage?: string;
    lastMessageData?: Date;
    userIds: string[];
    users: ProfileUser;

    chatPic?: string;
    chatName?: string;
}

export interface Message{
    text: string;
    senderId: string;
    sentData: Date;
}