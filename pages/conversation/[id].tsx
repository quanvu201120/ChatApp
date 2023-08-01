import React from 'react'
import ConversationC from '../../components/conversation'
import { db } from '../../config/firebase'
import { type } from 'os'
import { Conversation, Message } from '../../type'
import { GetServerSideProps } from 'next'
import { COLLECTION, generateQueryMessage, transMessage } from '../../utils'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { useRouter } from 'next/router'


type Props = {
    conversation: Conversation;
    messages: Message[]
}
const RouterConversation = ({ conversation, messages }: Props) => {
    const router = useRouter()

    if (!conversation || !messages) {
        router.push("/")
    }

    return (
        <>
            {conversation && messages && <ConversationC conversation={conversation} messages={messages} />}
        </>
    )
}

export default RouterConversation


export const getServerSideProps: GetServerSideProps<Props, { id: string }> = async context => {
    const conversationId = context.params?.id

    const conversationRef = doc(db, COLLECTION.conversations, conversationId as string)
    const convesationSnapshot = await getDoc(conversationRef)

    const queryMessages = generateQueryMessage(conversationId as string)
    const messagesSnapshot = await getDocs(queryMessages)

    const mess = messagesSnapshot?.docs?.map(messageDoc => transMessage(messageDoc))

    return {
        props: {
            conversation: convesationSnapshot?.data() as Conversation || null,
            messages: mess || null
        }
    }
}

