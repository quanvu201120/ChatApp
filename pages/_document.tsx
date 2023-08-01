import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body style={{ margin: "0px", padding: "0px", fontSize: "calc(0.6em + 1vmin)", minHeight: "100vh" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
