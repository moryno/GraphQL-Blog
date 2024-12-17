import { Link } from "react-router-dom";
import classes from "../home.module.css";
import { POSTS_ROUTE } from "constants/routes";

const WelcomeComponent = ({ user }) => {
  return (
    <article className={classes.titleInfoContainer}>
      <h2 className={classes.subTitle}>Welcome back {user?.name}</h2>
      <Link to={POSTS_ROUTE} className={classes.button}>
        Go to posts!
      </Link>
    </article>
  );
};

export default WelcomeComponent;
