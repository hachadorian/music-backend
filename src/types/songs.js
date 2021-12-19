import { gql } from "apollo-server-core";

export const songTypeDefs = gql`
  type Query {
    hello: String!
  }
`;
