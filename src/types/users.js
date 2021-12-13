import { gql } from "apollo-server-core";

export const usersTypeDefs = gql`
  type Query {
    hello: String!
  }
`;
