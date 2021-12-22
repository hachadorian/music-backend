import { gql } from "apollo-server-core";

export const typeDefs = gql`
  scalar Upload

  type Query {
    hello: String!
    me: User!
  }

  type Mutation {
    uploadSong(song: Upload): UploadResult
  }

  type User {
    id: String!
    username: String!
    email: String!
  }

  type Song {
    id: String!
    userId: String!
    name: String!
    genre: String!
    url: String!
  }

  type Errors {
    message: String!
  }

  union UploadResult = Song | Errors
`;
