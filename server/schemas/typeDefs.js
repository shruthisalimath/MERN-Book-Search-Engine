//import the ggl temlate function
const { gql } = require("apollo-server-express");

//create typeDefs queries and mutations

const typeDefs = gql`
type User {
    _id: ID!
    username: String!
    email:string
    bookCount: Int
    savedBooks: [Book]
}

type Book {
    bookId: Id!
    authors: [String]
    description: String
    image: String
    link: String
    title: String!
}

input BookInput {
    authors: [String]
    description: String
    bookId: String!
    image: String
    link: String
    title: String!
}

type Query{
    me:User
}

type Mutation{
    login(email: String!, password: String!) : Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!):User
    removeBook(bookId:ID!):User    
}

type Auth{
    token :ID!
    user:User
}

`;