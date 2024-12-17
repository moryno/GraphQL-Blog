import classes from "../post.module.css";
import noAvatar from "../../../assets/images/user.png";
import { formatDate } from "helpers/format";
import moment from "moment";
import { Link } from "react-router-dom";
import { POSTS_ROUTE } from "constants";

const Post = ({ post }) => {
  return (
    <article className={classes.card}>
      <div className={classes.topContainer}>
        <img
          className={classes.authorImg}
          src={noAvatar}
          alt="this is avatar icon"
        />
        <div className={classes.titleWrapper}>
          <h1>{post?.title}</h1>
          <p>
            Authored by <span>{post?.author?.name}</span>
          </p>
        </div>
      </div>
      <div className={classes.dateWrapper}>
        <p>{formatDate(post?.createdAt)}</p>
      </div>
      <p className={classes.description}>{post?.content}</p>
      <div className={classes.bottom}>
        <span>{moment(post?.createdAt).fromNow()}</span>
        <Link to={`${POSTS_ROUTE}/${post?._id}`}>View</Link>
      </div>
    </article>
  );
};

export default Post;
