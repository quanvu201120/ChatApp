import React from 'react'
import { Conversation } from '../../type';
import { styled } from 'styled-components';
import DeleteIcon from '@mui/icons-material/Delete';
import useRecipient from '../../hooks/useRecipient';
import RecipientAvatar from './recipientAvatar';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import { collection, doc, getDoc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { COLLECTION, generateQueryMessage } from '../../utils';
import AlertDialogConfirmDelete from './alertDialogDelete';

type Props = {
    idConversation: string;
    users: Conversation['users'];
    userLoggedEmail: string;
    close: any
}

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    word-break: break-all;
    padding: 10px;
    
    &:hover{
        background-color: whitesmoke;
        cursor: pointer;
    }
`

const StyledIconButton = styled(IconButton)`
    margin-left: auto;
`

const ConversationItem = ({ idConversation, users, userLoggedEmail, close }: Props) => {

    const { recipientEmail, recipient } = useRecipient(users, userLoggedEmail)

    const router = useRouter()

    const selectConversation = () => {
        router.push(`/conversation/${idConversation}`)
        close()
    }

    // const deleteConversation = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    //     e.stopPropagation()

    //     const batch = writeBatch(db)
    //     const querySnapshotMessagesDelete = await getDocs(generateQueryMessage(idConversation))
    //     const snapShotConversation = await getDoc(doc(db, COLLECTION.conversations, idConversation))

    //     batch.delete(snapShotConversation.ref)

    //     querySnapshotMessagesDelete.docs.forEach((snapShot, index) => {
    //         batch.delete(snapShot.ref)
    //     })

    //     await batch.commit()
    //     router.push("/")
    // }

    return (
        <StyledContainer onClick={selectConversation}>
            <RecipientAvatar recipientEmail={recipientEmail} recipient={recipient} />
            {recipientEmail}

            {/* <StyledIconButton onClick={deleteConversation}>
                <DeleteIcon />
            </StyledIconButton> */}

            <AlertDialogConfirmDelete id={idConversation} />

        </StyledContainer>
    )
}

export default ConversationItem