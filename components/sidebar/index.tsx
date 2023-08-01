import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import ChatIcon from '@mui/icons-material/Chat'
import MoreVerticalIcon from '@mui/icons-material/MoreVert'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from '../../config/firebase'
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material'
import * as EmailValidator from "email-validator";
import { addDoc, collection, query, where } from 'firebase/firestore'
import { Conversation } from '../../type'
import ConversationItem from './conversationItem'
import { COLLECTION } from '../../utils'


const StyledContainer = styled.div`
    height: 100vh;
    border-right: 1px solid #dddddd;
    padding: 0 10px;
    background: white;
    width: 330px;
    overflow-y: scroll;
    //Hide scrollbar for Chrome, Safari and Opera
    &::-webkit-scrollbar {
        display: none;
    }
    
    //Hide scrollbar for IE, Edge and Firefox
    -ms-overflow-style: none;  //IE and Edge
    scrollbar-width: none;  //Firefox

    
    @media screen and (max-width: 767px){
        width: 300px;
    }


    
`

const StyledHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1111;
    background-color: white;
    height: 60px;
    /* border-bottom: 1px solid #dddddd; */
`

const StyledUserAvatar = styled(Avatar)`
    :hover{
        cursor: pointer;
        opacity: 0.7;
    }
`

const StyledSearch = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const StyledSidebarButton = styled(Button)`
    width: 100%;
    border: 1px solid whitesmoke;
`
const StyledInputSidebar = styled.input`
    outline:none;
    border: none;
    border-radius: 5px;
    padding: 5px;
    flex: 1;
`

const Styled767Show = styled(IconButton)`
    height: 30px;
    z-index: 101;
    position: absolute;
    top: 35px;
    left: 0px;
    transform: translate(0,-50%) rotateY(180deg);
    @media screen and (min-width: 768px){
        display: none;
    }
`

const Styled767Hide = styled.div`
    @media screen and (max-width: 767px){
        display: none;
    }
`

export const Sidebar = () => {

    const [signOut] = useSignOut(auth);
    const [userAuthState] = useAuthState(auth);
    const [emailInput, setEmailInput] = useState("")
    const [openDialog, setOpenDialog] = useState(false);

    const queryGetConversationForCurrentUser = query(collection(db, "CONVERSATIONS"), where("users", "array-contains", userAuthState?.email))
    const [conversationsSnapshot, __loading, __error] = useCollection(queryGetConversationForCurrentUser)

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEmailInput("")
    };

    const isConversationExists = () => {
        return conversationsSnapshot?.docs.some(conversation => (conversation.data() as Conversation).users.includes(emailInput))
    }


    const createConversation = async () => {

        if (emailInput === userAuthState?.email) return

        if (EmailValidator.validate(emailInput) && !isConversationExists()) {
            //Add conversation user to db "CONVERSATION" collection
            // a conversation is between the currently logged and the user invited
            await addDoc(
                collection(db, COLLECTION.conversations),
                {
                    users: [userAuthState?.email, emailInput]
                }
            )
        }

        handleCloseDialog()
    }

    const [state, setState] = React.useState(false);
    const closeDrawer = () => {
        setState(false);

    }
    const toggleDrawer =
        (open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState(open);
            };

    const SideBarLayout = () => {
        return <StyledContainer>
            {/* Header             */}
            <StyledHeader>
                <Tooltip placement={'right'} title={userAuthState?.email} >
                    <StyledUserAvatar src={userAuthState?.photoURL || ""}></StyledUserAvatar>
                </Tooltip>
                <div>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>

                    <IconButton>
                        <MoreVerticalIcon />
                    </IconButton>

                    <IconButton onClick={signOut}>
                        <LogoutIcon />
                    </IconButton>

                </div>
            </StyledHeader>
            {/* End Header */}

            <StyledSearch>
                <SearchIcon />
                <StyledInputSidebar placeholder='Search conversations' ></StyledInputSidebar>
            </StyledSearch>

            <StyledSidebarButton onClick={handleClickOpenDialog}>Start a new converstion</StyledSidebarButton>

            {conversationsSnapshot?.docs?.map((conversation) => {
                return <ConversationItem
                    key={conversation.id}
                    idConversation={conversation.id}
                    users={(conversation.data() as Conversation).users}
                    userLoggedEmail={userAuthState?.email as string}
                    close={closeDrawer}
                />
            })}

            {/* Dialog         */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>New conversation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a Google email address for the user you wish to chat with
                    </DialogContentText>
                    <TextField
                        value={emailInput}
                        onChange={event => setEmailInput(event.target.value)}
                        autoFocus
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button disabled={!emailInput} onClick={createConversation}>Create</Button>
                </DialogActions>
            </Dialog>
            {/* End Dialog */}

        </StyledContainer>
    }

    return (
        <>
            <Styled767Show onClick={toggleDrawer(true)}>
                <MenuOpenIcon fontSize='medium' />
            </Styled767Show>
            <Drawer
                anchor={'left'}
                open={state}
                onClose={toggleDrawer(false)}
            >
                {SideBarLayout()}
            </Drawer>

            <Styled767Hide>
                {SideBarLayout()}
            </Styled767Hide>
        </>
    )
}
