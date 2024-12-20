import classes from "../post.module.css";
import placeholder from "../../../assets/images/placeholder.png";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { graphQlService } from "services";
import { formatDate } from "helpers/format";
import moment from "moment";
import { COMPOSE_ROUTE } from "constants";
import { LoadingComponent } from "lib";

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getSinglePost = useCallback(async (id) => {
    const graphqlQuery = {
      query: `
        query GetPostByID($id: ID!){
          post(id: $id){
            _id
            title
            content
            imageUrl
            author{
              name
            }
            createdAt
          }
        }
      `,
      variables: {
        id,
      },
    };

    try {
      const { data } = await graphQlService.post(graphqlQuery);
      setPost(data?.data?.post);
    } catch (error) {
      throw new Error("Failed to get post. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (postId) {
      getSinglePost(postId);
    }
  }, [getSinglePost, postId]);

  const onDelete = async () => {
    try {
      const graphqlQuery = {
        query: `
          mutation{
            deletePost(id: "${postId}")
          }
        `,
      };

      await graphQlService.post(graphqlQuery);
      navigate(-1);
    } catch (error) {
      throw new Error("Failed to delete post. Please try again later.");
    }
  };

  const handleButtonClick = (type) => {
    switch (type) {
      case "goBack":
        navigate(-1);
        break;
      case "edit":
        navigate(COMPOSE_ROUTE, { state: { editedPost: post } });
        break;
      case "delete":
        onDelete();
        break;

      default:
        break;
    }
  };

  if (loading) return <LoadingComponent />;

  return (
    <main className={classes.posts}>
      <section className={classes.postWrapper}>
        <article className={classes.topPostContainer}>
          <div className={classes.postTitleInfoContainer}>
            <div className={classes.overlay}></div>
            <img
              src={post?.imageUrl || placeholder}
              alt="this is a post icon"
            />
            <div className={classes.titleInfoWrapper}>
              <h1>{post?.title}</h1>
              <span>{formatDate(post?.createdAt)}</span>
              <p>
                Authored by <span>{post?.author?.name}</span>
              </p>
            </div>
          </div>
          <div className={classes.titleInfoButtonContainer}>
            <button
              onClick={() => handleButtonClick("goBack")}
              className={`${classes.actionButton} ${classes.close}`}
            >
              Close Post
            </button>
            <div>
              <button
                onClick={() => handleButtonClick("edit")}
                className={`${classes.actionButton} ${classes.edit}`}
              >
                Edit
              </button>
              <button
                onClick={() => handleButtonClick("delete")}
                className={`${classes.actionButton} ${classes.delete}`}
              >
                Delete
              </button>
            </div>
          </div>
        </article>
        <article className={classes.card}>
          <p className={classes.postDate}>
            {moment(post?.createdAt).fromNow()}
          </p>
          <p className={classes.content}>{post?.content}</p>
        </article>
      </section>
    </main>
  );
};

export default PostDetails;
