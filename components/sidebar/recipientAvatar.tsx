import React from 'react'
import useRecipient from '../../hooks/useRecipient'
import Avatar from '@mui/material/Avatar'
import styled from 'styled-components'

type Props = ReturnType<typeof useRecipient>

const StyledAvatar = styled(Avatar)`
    margin: 0 10px;
`

const RecipientAvatar = ({ recipient, recipientEmail }: Props) => {
    return recipient?.photoURL ? <StyledAvatar src={recipient.photoURL} /> : <StyledAvatar>{recipientEmail && recipientEmail[0].toUpperCase()}</StyledAvatar>
}

export default RecipientAvatar