import Head from 'next/head'
import { Sidebar } from '../components/sidebar'
import styled from 'styled-components'


const StyledContainer = styled.div`
    display:flex;
    height:100vh;
    width: 100%;
`

const StyledText = styled.div`
  display: grid;
  place-items: center;
  line-height: 100%;
  height:100%;
  flex-grow: 1;
  font-size: calc(1em + 1vmin);
`

export default function Home() {
  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StyledContainer>
        <Sidebar />
        <StyledText>
          Please select a conversation
        </StyledText>
      </StyledContainer>
    </>
  )
}
