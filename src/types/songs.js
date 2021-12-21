import { gql } from "apollo-server-core";

export const songsTypeDefs = gql`
  scalar Upload

  type Query {
    hello: String!
  }

  type Mutation {
    uploadSong(song: Upload): UploadResult
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
