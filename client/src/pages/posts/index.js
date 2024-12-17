import { useCallback, useEffect, useState } from "react";
import Post from "./components/Post";
import classes from "./post.module.css";
import { graphQlService } from "services";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  const getAllPosts = useCallback(async () => {
    const graphqlQuery = {
      query: `
        query{
          posts{
            _id
            title
            content
            author{
              name
            }
            createdAt
          }
        }
      `,
    };

    try {
      const { data } = await graphQlService.post(graphqlQuery);
      setPosts(data?.data?.posts);
    } catch (error) {
      throw new Error("Failed to get posts. Please try again later.");
    }
  }, []);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  return (
    <main className={classes.posts}>
      <section className={classes.postWrapper}>
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </section>
    </main>
  );
};

export default Posts;
