import { useContext, useState } from "react";
import classes from "../login.module.css";
import { graphQlService } from "services";
import { UserContext } from "context";
import { useNavigate } from "react-router-dom";
import { LANDING_PAGE_ROUTE } from "constants";
import { LOGIN_ROUTE } from "constants";

const AuthForm = ({ isRegisterRoute }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { onLogin } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChangeValue = (e) => {
    const { value, name } = e.target;

    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    let graphqlQuery;

    try {
      if (isRegisterRoute) {
        graphqlQuery = {
          query: `
          mutation {
              register(userInput: {email: "${formValue.email}", name: "${formValue.name}", password: "${formValue.password}"}){
                _id
                name
                email
              }
            }
          `,
        };
      } else {
        graphqlQuery = {
          query: `
          query {
            login(email: "${formValue.email}", password: "${formValue.password}"){
            userId
            token, 
            name
            }
            }
          `,
        };
      }

      const { data } = await graphQlService.post(graphqlQuery);

      if (isRegisterRoute) {
        navigate(LOGIN_ROUTE);
      } else {
        const currentUser = {
          user: data.data.login,
        };

        onLogin(currentUser);
        navigate(LANDING_PAGE_ROUTE);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={classes.authForm} onSubmit={handleSubmit}>
      {isRegisterRoute && (
        <>
          <label htmlFor="name">Name</label>
          <input
            className={classes.authInput}
            onChange={handleChangeValue}
            id="name"
            name="name"
            type="text"
            required
            placeholder="Enter password..."
          />
        </>
      )}
      <label htmlFor="email">Email</label>
      <input
        className={classes.authInput}
        onChange={handleChangeValue}
        id="email"
        name="email"
        type="text"
        required
        placeholder="Enter email..."
      />
      <label htmlFor="password">Password</label>
      <input
        className={classes.authInput}
        onChange={handleChangeValue}
        id="password"
        name="password"
        type="password"
        required
        placeholder="Enter password..."
        autoComplete="new-password"
      />
      <button className={classes.authButton} disabled={isLoading}>
        {isRegisterRoute ? "Sign Up" : "Sign In"}
      </button>
    </form>
  );
};

export default AuthForm;
