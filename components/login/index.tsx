import Button from '@mui/material/Button'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'
import WhatAppLogo from '../../assets/whatsapp.png'
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase'
import { useRouter } from 'next/router'


const StyledContainer = styled.div`
    height:100vh;
    display: grid;
    place-items: center;
    background-color: whitesmoke;
`
const StyledLoginContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    padding: 100px;
    border-radius: 10px;
    background: white;
    box-shadow: 0 10px -3px grb(0 0 0 / 0.1), 0 4px 6px -4px grb(0 0 0 / 0.1);
`

const StyledImageWrapper = styled.div`
    margin-bottom: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`


const Login = () => {

    const [userAuthState] = useAuthState(auth);
    const [signInWithGoogle, _user, loading, error] = useSignInWithGoogle(auth);
    const router = useRouter()

    if (userAuthState) {
        router.push("/")
    }


    return (
        <StyledContainer>
            <Head>
                <title>Login</title>
            </Head>

            <StyledLoginContainer>
                <StyledImageWrapper>
                    <Image height={200} width={200} src={WhatAppLogo} alt={''} />
                </StyledImageWrapper>
                <Button variant='outlined' onClick={() => { signInWithGoogle() }}>Login with google</Button>
            </StyledLoginContainer>

        </StyledContainer>
    )
}

export default Login