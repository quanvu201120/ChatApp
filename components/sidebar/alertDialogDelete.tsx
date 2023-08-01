import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress';
import { TransitionProps } from '@mui/material/transitions';
import { doc, getDoc, getDocs, writeBatch } from 'firebase/firestore';
import { COLLECTION, generateQueryMessage } from '../../utils';
import { db } from '../../config/firebase';
import { useRouter } from 'next/router';
import { IconButton } from '@mui/material';
import styled from 'styled-components';
import { useState } from 'react';

const StyledActionContainer = styled(DialogActions)`
    display: flex;
    justify-content: space-evenly;
`

const StyledDiaglogTitle = styled(DialogTitle)`
    text-align: center;
`

const Styled767Show = styled(IconButton)`
    @media screen and (min-width: 768px){
        display: none;
    }
`

const Styled767Hide = styled.div`
    @media screen and (max-width: 767px){
        display: none;
    }
`

const StyledConfirmContainer = styled.div`
    
`
const StyledCircularProgress = styled(CircularProgress)`
    position:absolute;
`


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function AlertDialogConfirmDelete({ id }: { id: string }) {
    const [open, setOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false)
    const [progress, setProgress] = useState(0);

    const router = useRouter()
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteConversation = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()

        const batch = writeBatch(db)
        const querySnapshotMessagesDelete = await getDocs(generateQueryMessage(id))
        const snapShotConversation = await getDoc(doc(db, COLLECTION.conversations, id))

        batch.delete(snapShotConversation.ref)

        querySnapshotMessagesDelete.docs.forEach((snapShot, index) => {
            batch.delete(snapShot.ref)
        })

        await batch.commit()
        router.push("/")
    }

    const handleShowConfirm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        setShowConfirm(true)

        const timer = setInterval(() => {
            setProgress((prevProgress) => prevProgress + 10);
        }, 500);

        setTimeout(() => {
            setShowConfirm(false)
            clearInterval(timer);
            setProgress(0);
        }, 5500);

    }

    return (
        <div style={{ marginLeft: "auto" }}>
            <Styled767Show>
                {!showConfirm ?
                    <>
                        <IconButton
                            onClick={handleShowConfirm}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </>
                    :
                    <>
                        <IconButton
                            onClick={deleteConversation}
                        >
                            <CheckCircleIcon color='info' />
                        </IconButton>
                        <StyledCircularProgress onClick={deleteConversation} variant="determinate" value={progress} />
                    </>
                }
            </Styled767Show>

            <Styled767Hide>
                <IconButton onClick={handleClickOpen}>
                    <DeleteIcon />
                </IconButton>
            </Styled767Hide>

            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <StyledDiaglogTitle>{"Do you want to delete this conversation?"}</StyledDiaglogTitle>
                {/* <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Let Google help apps determine location. This means sending anonymous
                        location data to Google, even when no apps are running.
                    </DialogContentText>
                </DialogContent> */}
                <StyledActionContainer>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={deleteConversation}>Agree</Button>
                </StyledActionContainer>
            </Dialog>
        </div>
    );
}