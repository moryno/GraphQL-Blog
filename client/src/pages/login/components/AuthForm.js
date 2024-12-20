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
  const [errors, setErrors] = useState(null);
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
          mutation CreateUser($email: String!, $name: String!, $password: String!){
              register(userInput: { email: $email, name: $name, password: $password }){
                _id
                name
                email
              }
            }
          `,
          variables: {
            email: formValue.email,
            name: formValue.name,
            password: formValue.password,
          },
        };
      } else {
        graphqlQuery = {
          query: `
          query SignIn($email: String!, $password: String!){
            login(email: $email, password: $password){
            userId
            token, 
            name
            }
            }
          `,
          variables: {
            email: formValue.email,
            password: formValue.password,
          },
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
      if (error.response.data.errors[0].status === 422) {
        setErrors(error.response.data.errors[0].data);
        return;
      }
      console.log(error);
      setErrors([{ message: "User creation failed." }]);
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
      {errors &&
        errors.map((err, i) => (
          <p key={i} className={classes.error}>
            {err.message}
          </p>
        ))}
      <button className={classes.authButton} disabled={isLoading}>
        {isRegisterRoute ? "Sign Up" : "Sign In"}
      </button>
    </form>
  );
};

export default AuthForm;
