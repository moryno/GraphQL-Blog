import { getIsRegisterRoute } from "helpers/routeHelper";
import AuthForm from "./components/AuthForm";
import classes from "./login.module.css";
import { useLocation } from "react-router-dom";

const Login = () => {
  const { pathname, search } = useLocation();
  const isRegisterRoute = getIsRegisterRoute(pathname, search);
  return (
    <main className={classes.authContainer}>
      <section className={classes.authMain}>
        <article className={classes.authContent}>
          <p className={classes.authTitle}>
            {isRegisterRoute ? "Register" : "Login"} to Graphtivities
          </p>
        </article>
        <AuthForm isRegisterRoute={isRegisterRoute} />
      </section>
    </main>
  );
};

export default Login;
