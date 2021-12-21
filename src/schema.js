import { makeExecutableSchema } from "@graphql-tools/schema";
import { songsTypeDefs } from "./types/songs";
import { songsResolver } from "./resolvers/songs";

export const schema = makeExecutableSchema({
  typeDefs: songsTypeDefs,
  resolvers: songsResolver,
});
