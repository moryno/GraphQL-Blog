import classes from "./index.module.css";

const LoadingComponent = () => {
  return (
    <main className={classes.loaderMain}>
      <div className={classes.spinner}></div>
    </main>
  );
};

export default LoadingComponent;
