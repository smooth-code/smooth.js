import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  color: #000;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, Roboto, 'Segoe UI',
    'Fira Sans', Avenir, 'Helvetica Neue', 'Lucida Grande', sans-serif;
  height: 90vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Title = styled.h1`
  display: inline-block;
  border-right: 1px solid rgba(0, 0, 0, 0.3);
  margin: 0;
  margin-right: 20px;
  padding: 10px 24px 10px 0;
  font-size: 24px;
  font-weight: 500;
  vertical-align: top;
`

const Subtitle = styled.div`
  display: inline-block;
  text-align: left;
  line-height: 50px;
  height: 50px;
  vertical-align: middle;

  > h2 {
    font-size: 14px;
    font-weight: normal;
    line-height: inherit;
    margin: 0;
    padding: 0;
  }
`

const Stack = styled.code`
  padding-top: 20px;
  max-height: 400px;
  overflow: auto;
  max-width: 90%;
  text-align: left;
`

export default function ErrorPage({ error }) {
  return (
    <Container>
      <div>
        <Title>{error.statusCode || error.name}</Title>
        <Subtitle>
          <h2>{error.message}</h2>
        </Subtitle>
      </div>
      <Stack>
        <pre>{error.stack}</pre>
      </Stack>
    </Container>
  )
}
