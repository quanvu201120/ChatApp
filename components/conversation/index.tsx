import React from 'react'
import { Sidebar } from '../sidebar'
import styled from 'styled-components'
import Head from 'next/head'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../../config/firebase'
import { Conversation, Message } from '../../type'
import { GetServerSideProps } from 'next'
import { getEmail } from '../../utils'
import { useAuthState } from 'react-firebase-hooks/auth'
import ConversationScreen from './screen'

type Props = {
    conversation: Conversation;
    messages: Message[]
}

const StyledContainer = styled.div`
    display: flex;
    margin: 0;
    padding: 0;
`

const StyledConversationContainer = styled.div`
    flex-grow: 1;
    overflow-y: scroll;
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
    display: none;
    }
    
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
`



const ConversationC = ({ conversation, messages }: Props) => {

    const [loggedUser] = useAuthState(auth)

    return (
        <StyledContainer>
            <Head>
                <title>Conversation with {getEmail(conversation.users, loggedUser?.email as string)}</title>
            </Head>
            <Sidebar />
            <StyledConversationContainer>
                <ConversationScreen conversation={conversation} messages={messages} loggedUser={loggedUser} />
            </StyledConversationContainer>
        </StyledContainer>
    )
}

export default ConversationC
