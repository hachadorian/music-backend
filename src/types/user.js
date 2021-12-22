import { gql } from "apollo-server-core";

export const userTypeDefs = gql`
  type Query {
    me: User
  }

  type User {
    id: String!
    username: String!
    email: String!
  }
`;
