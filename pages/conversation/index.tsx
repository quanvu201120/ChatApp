import React from 'react'
import Conversation from '../../components/conversation'
import { useRouter } from 'next/router'

const index = () => {
    const router = useRouter()
    router.push("/not-found-404")
    return (
        <></>
    )
}

export default index