import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import express from "express";
import http from "http";
import { schema } from "./schema";
import passport from "passport";
import { Strategy as TwitchStrategy } from "passport-twitch-new";
import dotenv from "dotenv";
import { dbAccess } from "./utils/dbAccess";
import { createClient } from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { graphqlUploadExpress } from "graphql-upload";
import cors from "cors";

const main = async () => {
  dotenv.config();

  const app = express();
  const httpServer = http.createServer(app);
  app.use(
    cors({
      origin: process.env.ORIGIN,
      credentials: true,
    })
  );

  const RedisStore = connectRedis(session);
  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on("connect", () => {
    console.log("connected to redis...");
  });

  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 10,
      },
    })
  );

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

  app.use(graphqlUploadExpress());

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.use(passport.initialize());

  passport.use(
    new TwitchStrategy(
      {
        clientID: process.env.TWITCH_CLIENTID,
        clientSecret: process.env.TWITCH_SECRET,
        callbackURL: process.env.TWITCH_CALLBACK,
        scope: "user_read",
      },
      async (accessToken, refreshToken, profile, done) => {
        const { id, email, login } = profile;

        let user = await dbAccess.findOne("users", { field: "id", value: id });

        if (!user) {
          user = { id, email, username: login };
          await dbAccess.insertOne("users", user);
        }

        return done(null, { id: user.id });
      }
    )
  );

  app.get("/auth/twitch", passport.authenticate("twitch"));
  app.get(
    "/auth/twitch/callback",
    passport.authenticate("twitch", { session: false }),
    (req, res) => {
      req.session.qid = req.user.id;
      // Successful authentication, redirect frontend.
      res.redirect("http://localhost:3000/home");
    }
  );

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`server started on http://localhost:${port}/graphql`);
  });
};

main().catch((err) => {
  console.error(err);
});
