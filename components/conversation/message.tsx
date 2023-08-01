import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { Message } from '../../type'
import styled, { css } from 'styled-components'
import { collection, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { COLLECTION } from '../../utils';
import { db } from '../../config/firebase';

type Props = {
    message: Message,
    emailLogged: string
}

const StyledMessageItem = styled.div`
    width: fit-content;
    word-break: break-all;
    max-width: 80%;
    min-width: 30%;
    padding: 10px;
    border-radius: 5px;
    margin:10px;
    position: relative;

`

const StyledMessageSender = styled(StyledMessageItem)`
    margin-left:auto;
    background: #dcf8d6;

    &:hover{
        >button{
            visibility: visible;
        }
    }
`
const StyledMessageReceiver = styled(StyledMessageItem)`
    background: white;
`

const StyledTimestamp = styled.span`
    color: gray;
    font-size: x-small;
    position: absolute;
    bottom: 0;
    right: 10px;
    display: block;
`

const StyledIconButton = styled(IconButton)`
    position: absolute;
    top: 0;
    visibility: hidden;
    left: -36px;
    
`

const IMessage = ({ emailLogged, message }: Props) => {

    const Message = message.email === emailLogged ? StyledMessageSender : StyledMessageReceiver

    const deleteMessage = async (messageId: string) => {
        await deleteDoc(doc(db, COLLECTION.messages, message.id as string))
    }

    return (
        <Message>
            {message.text}
            <StyledTimestamp>
                {message.sentAt}
            </StyledTimestamp>
            <StyledIconButton onClick={() => deleteMessage(message.id as string)}>
                <DeleteIcon fontSize='small' />
            </StyledIconButton>
        </Message>
    )
}

export default IMessage