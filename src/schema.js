import { makeExecutableSchema } from "@graphql-tools/schema";
import { userTypeDefs } from "./types/user";
import { songsTypeDefs } from "./types/songs";
import { userResolver } from "./resolvers/user";
import { songsResolver } from "./resolvers/songs";
import { merge } from "lodash";

export const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs, songsTypeDefs],
  resolvers: merge(userResolver, songsResolver),
});
