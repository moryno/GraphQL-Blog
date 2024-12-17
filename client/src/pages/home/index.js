import classes from "./home.module.css";
import logo from "../../assets/images/logo.png";
import WelcomeComponent from "./components/WelcomeComponent";
import SignInComponent from "./components/SignInComponent";
import { useContext } from "react";
import { UserContext } from "context";

const Home = () => {
  const { user, isAuthenticated } = useContext(UserContext);
  return (
    <main className={classes.masthead}>
      <section>
        <article className={classes.titleWrapper}>
          <img src={logo} alt="this is blog log" />
          <h1>Graphtivities</h1>
        </article>
        {isAuthenticated ? (
          <WelcomeComponent user={user} />
        ) : (
          <SignInComponent />
        )}
      </section>
    </main>
  );
};

export default Home;
