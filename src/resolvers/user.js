import { dbAccess } from "../utils/dbAccess";

export const userResolver = {
  Query: {
    me: async (root, args, context) => {
      const user = await dbAccess.findOne("users", {
        field: "id",
        value: context.req.session.qid,
      });
      return user;
    },
  },
};
