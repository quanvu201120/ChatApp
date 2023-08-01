import React, { useRef, useState } from 'react'
import { Conversation, Message } from '../../type';
import useRecipient from '../../hooks/useRecipient';
import { User } from 'firebase/auth';
import { COLLECTION, convertTimestamp, generateQueryMessage, getEmail, transMessage } from '../../utils';
import styled from 'styled-components';
import RecipientAvatar from '../sidebar/recipientAvatar';
import { IconButton } from '@mui/material';
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertEmotionIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import MoreVerticalIcon from "@mui/icons-material/MoreVert";
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore';
import IMessage from './message';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

type Props = {
    conversation: Conversation;
    messages: Message[];
    loggedUser: User | null | undefined
}

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`

const StyledHeader = styled.div`
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    /* padding: 10px; */
    height: 80px;
    border-bottom: 1px solid whitesmoke;
    background: white;
    @media screen and (max-width: 767px){
        padding-left: 40px;
    }
`

const StyledInfo = styled.div`
    flex-grow: 1;

    > h3 {
        margin-top: 0;
        margin-bottom: 3px;
    }

    > span {
        font-size: 14px;
        color: gray;
    }

`

const StyledH3 = styled.h3`
    word-break: break-all;
`

const StyledSpan = styled.span`
    display: grid;
    margin: 0;
    padding: 0;
    text-align: left;
    width: 100%;
`

const StyledMessageContainer = styled.div`
    padding: 20px;
    background: #e5ded8;
    height: 100%;
    flex-grow: 1;
    overflow-y: scroll;
`

const StyledInputContainer = styled.form`
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 100;
    padding: 5px;
    background: white;

    @media screen and (min-width: 768px) {
        position: sticky;
    }

`

const StyledP = styled.p`
    margin: 0;
    padding: 0;
    width: max-content;
    color: blue;
`

const StyledInput = styled.input`
    flex-grow: 1;
    padding: 10px;
    outline: none;
    border: none;
    background: whitesmoke;
    margin: 0 10px;
`

const ConversationScreen = ({ conversation, messages, loggedUser }: Props) => {

    const { recipient, recipientEmail } = useRecipient(conversation.users, loggedUser?.email as string)
    const [valueInput, setValueInput] = useState("")

    const router = useRouter()

    const conversationId = router.query.id as string

    const queryMessage = generateQueryMessage(conversationId)
    const [messagesSnapshot, _loading, _error] = useCollection(queryMessage)


    const showMessages = () => {

        // console.log(_loading ? "loading " : "oke ", messages)


        if (_loading) {
            return messages.map(item => <IMessage key={item.id} message={item} emailLogged={loggedUser?.email as string} />)
        }
        return messagesSnapshot?.docs.map((item) => <IMessage key={item.id} message={transMessage(item)} emailLogged={loggedUser?.email as string} />)
    }

    const addMessage = async () => {
        if (!valueInput) return

        setValueInput("")

        await setDoc(
            doc(db, COLLECTION.users, loggedUser?.uid as string),
            { lastSeen: serverTimestamp() },
            { merge: true }
        )

        const newMessage = {
            conversationId: conversationId,
            email: loggedUser?.email,
            sentAt: serverTimestamp(),
            text: valueInput,
            userId: loggedUser?.uid
        }

        await addDoc(collection(db, COLLECTION.messages), newMessage)


    }

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValueInput(e.target.value)
    }

    const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        addMessage()
    }

    return (
        <StyledContainer>
            <StyledHeader>
                <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail} />
                <StyledInfo>
                    <StyledH3>
                        {recipientEmail}
                    </StyledH3>
                    <StyledSpan>
                        {recipient && <>{recipient.online ? <StyledP>&bull; Online</StyledP> : `Last active: ${convertTimestamp(recipient?.lastSeen)}`}</>}
                    </StyledSpan>
                </StyledInfo>
                <IconButton>
                    <AttachFileIcon />
                </IconButton>
                <IconButton>
                    <MoreVerticalIcon />
                </IconButton>

            </StyledHeader>
            <StyledMessageContainer>
                {showMessages()}
            </StyledMessageContainer>
            <StyledInputContainer onSubmit={onSubmitForm}>
                <InsertEmotionIcon />

                <StyledInput
                    type="text"
                    value={valueInput}
                    onChange={onChangeInput}
                />

                <IconButton>
                    <MicIcon />
                </IconButton>

                <IconButton
                    style={{ marginRight: "10px" }}
                    onClick={addMessage}
                >
                    <SendIcon />
                </IconButton>


            </StyledInputContainer>

        </StyledContainer>
    )
}

export default ConversationScreen