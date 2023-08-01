import { collection, query, where } from "firebase/firestore"
import { AppUser, Conversation } from "../type"
import { COLLECTION, getEmail } from "../utils"
import { db } from "../config/firebase"
import { useCollection } from "react-firebase-hooks/firestore"

const useRecipient = (conversationUser: Conversation['users'], loggedUserEmail: string) => {

    const recipientEmail = getEmail(conversationUser, loggedUserEmail)

    const queryGetRecipient = query(collection(db, COLLECTION.users), where("email", "==", recipientEmail))

    const [recipientsSnapshot, _loading, _error] = useCollection(queryGetRecipient)

    const recipient = recipientsSnapshot?.docs[0]?.data() as AppUser

    return { recipientEmail, recipient }

}

export default useRecipient