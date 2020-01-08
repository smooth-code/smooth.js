import 'isomorphic-fetch'
import { apolloClient } from 'smooth/graphql'
import gql from 'graphql-tag'

export default function Index(props) {
  console.log(props)
  return 'Hello'
}

const Page = gql`
  query Page {
    page(slug: "test2") {
      title
    }
  }
`

Index.getInitialProps = async () => {
  const result = await apolloClient.query({ query: Page })
  console.log(result.data.page)
  return { hello: 'ok ' }
}
