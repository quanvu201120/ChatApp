import { DocumentData, QueryDocumentSnapshot, Timestamp, collection, orderBy, query, where } from "firebase/firestore";
import { Conversation, Message } from "../type";
import { db } from "../config/firebase";

export const COLLECTION = {
    users: "USERS",
    messages: "MESSAGES",
    conversations: "CONVERSATIONS"
}

export const getEmail = (conversationUser: Conversation['users'], loggedUserEmail: string) => {
    return conversationUser?.find(email => email !== loggedUserEmail)
}

export const generateQueryMessage = (conversationId: string) => {

    return query(collection(db, COLLECTION.messages), where("conversationId", "==", conversationId), orderBy("sentAt", "asc"))
}

export const convertTimestamp = (t: Timestamp) => {
    if (t)
        return new Date(t.toDate().getTime()).toLocaleString()
}

export const transMessage = (messageDoc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
    return {
        ...(messageDoc.data() as Message),
        id: messageDoc.id,
        sentAt: messageDoc.data().sentAt ? convertTimestamp(messageDoc.data().sentAt as Timestamp) : ""
    } as Message
}