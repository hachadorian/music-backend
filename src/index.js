import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import express from "express";
import http from "http";
import { schema } from "./schema";

const main = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer({
    schema: schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: ({ req, res }) => ({ req, res }),
    uploads: false,
    introspection: true,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
    path: "/",
  });

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`server started on http://localhost:${port}/graphql`);
  });
};

main().catch((err) => {
  console.error(err);
});
