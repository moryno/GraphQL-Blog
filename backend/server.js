import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import { graphqlHTTP } from "express-graphql";
import graphqlSchema from "./src/graphql/schema.js";
import graphqlResolver from "./src/graphql/resolvers.js";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to blogDB");
  } catch (error) {
    console.log(error);
  }
};

app.use(express.json());
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const status = err.originalError.code || 500;

      return { message, status, data };
    },
  })
);

app.listen(process.env.PORT || 8080, () => {
  connect();
  console.log("Backend running at port 8080");
});
