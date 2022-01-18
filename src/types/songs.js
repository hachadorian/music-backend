import { gql } from "apollo-server-core";

export const songsTypeDefs = gql`
  scalar Upload

  type Query {
    getAllSongs: [Song]
  }

  type Mutation {
    uploadSong(name: String, genre: String, song: Upload): UploadResult
  }

  type Song {
    id: String!
    userid: String!
    name: String!
    genre: String!
    url: String!
    artist: User!
  }

  type Errors {
    message: String!
  }

  union UploadResult = Song | Errors
`;
