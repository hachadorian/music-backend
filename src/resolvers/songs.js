import { dbAccess } from "../utils/dbAccess";
import { uploadFile } from "../utils/awsS3Uploader";
import { v4 as uuid } from "uuid";

export const songsResolver = {
  Query: {
    hello: () => "hello_world",
  },
  Mutation: {
    uploadSong: async (root, args, context) => {
      const user = await dbAccess.findOne("user", {
        field: "id",
        value: context.req.session.userId,
      });

      if (!user) {
        return {
          __typename: "Errors",
          message: "user cannot be found",
        };
      }

      const { file } = await args.song;
      if (file.mimetype !== "audio/mpeg") {
        return {
          __typename: "Errors",
          message: "incorrect file type",
        };
      }

      let song = {
        id: uuid(),
        userid: context.req.session.userId,
        name: args.name,
        genre: args.genre,
      };

      await uploadFile(song.id, file);
      song.url = process.env.CLOUDFRONT_URL + song.id;
      await dbAccess.insertOne("songs", song);

      return {
        __typename: "Song",
        ...song,
      };
    },
  },
};
