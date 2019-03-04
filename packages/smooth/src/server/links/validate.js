import { ApolloLink, Observable } from 'apollo-link'
import { validate } from 'graphql/validation'

export class ValidateLink extends ApolloLink {
  constructor({ schema }) {
    super()
    this.schema = schema
  }

  request(operation, forward) {
    return new Observable(observer => {
      let subscription

      Promise.resolve(validate(this.schema, operation.query))
        .then(graphQLErrors => {
          if (graphQLErrors.length) {
            const error = new Error('Validation error')
            error.errors = graphQLErrors
            throw error
          } else {
            subscription = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            })
          }
        })
        .catch(error => {
          observer.error(error)
        })

      return () => {
        if (subscription) {
          subscription.unsubscribe()
        }
      }
    })
  }
}
