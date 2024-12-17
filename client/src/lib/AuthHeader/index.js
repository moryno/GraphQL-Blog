import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import noAvatar from "../../assets/images/user.png";
import classes from "./nav.module.css";
import {
  COMPOSE_ROUTE,
  LANDING_PAGE_ROUTE,
  POSTS_ROUTE,
} from "constants/routes";
import { useContext } from "react";
import { UserContext } from "context";

const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <nav className={classes.nav}>
      <section>
        <article>
          <Link to={LANDING_PAGE_ROUTE} className={classes.navLink}>
            <div>
              <img src={logo} alt="this is blog log" />
              <h1>Graphtivities</h1>
            </div>
          </Link>
          <Link to={POSTS_ROUTE} className={classes.navLink}>
            Posts
          </Link>
          <Link to={COMPOSE_ROUTE} className={classes.navLink}>
            <button>Compose</button>
          </Link>
        </article>
        <div>
          <img
            className={classes.navProfile}
            src={noAvatar}
            alt="this is avatar icon"
          />
          <span>{user?.name}</span>
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
