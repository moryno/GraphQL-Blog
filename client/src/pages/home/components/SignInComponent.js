import { Link } from "react-router-dom";
import classes from "../home.module.css";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "constants/routes";

const SignInComponent = () => {
  return (
    <article className={classes.titleInfoContainer}>
      <div>
        <Link to={LOGIN_ROUTE} className={classes.button}>
          Login!
        </Link>
        <Link to={REGISTER_ROUTE} className={classes.button}>
          Register
        </Link>
      </div>
    </article>
  );
};

export default SignInComponent;
