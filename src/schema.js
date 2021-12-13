import { makeExecutableSchema } from "@graphql-tools/schema";
import { usersTypeDefs } from "./types/users";
import { usersResolver } from "./resolvers/users";

export const schema = makeExecutableSchema({
  typeDefs: usersTypeDefs,
  resolvers: usersResolver,
});
