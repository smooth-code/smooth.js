import React from 'react'
import gql from 'graphql-tag'

export const propsFragment = gql`
  fragment MovieCardProps on MovieCard {
    title
    movie {
      title
    }
  }
`

const MovieCard = ({ title }) => <div>{title}</div>

export default MovieCard
