//setup for react and Apollo client
import { gql } from "@apollo/client";

// setup for User data and any saved book data
// loads in 'SavedBooks.js'
export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;