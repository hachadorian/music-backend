import { dbAccess } from "../utils/dbAccess";
import { uploadFile } from "../utils/awsS3Uploader";
import { v4 as uuid } from "uuid";
import { db } from "../db/connection";

function hydrate(songs) {
  return songs.map((x) => ({
    ...x,
    artist: {
      id: x.userid,
      username: x.username,
    },
  }));
}

export const songsResolver = {
  Query: {
    getAllSongs: async (root, args, context) => {
      const songs = await db.raw(
        "select songs.id, songs.name, songs.genre, songs.url, songs.userid, users.username from songs left join users on songs.userid = users.id"
      );
      return hydrate(songs.rows);
    },
    getAllGenres: async (root, args, context) => {
      const genres = await db.distinct("genre").from("songs");
      return genres;
    },
  },
  Mutation: {
    uploadSong: async (root, args, context) => {
      const user = await dbAccess.findOne("users", {
        field: "id",
        value: context.req.session.qid,
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
        userid: context.req.session.qid,
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
