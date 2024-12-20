import { useState } from "react";
import classes from "./compose.module.css";
import { uploadImage } from "utils";
import { graphQlService } from "services";
import { useLocation, useNavigate } from "react-router-dom";
import { POSTS_ROUTE } from "constants";

const Compose = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const editedPost = location.state?.editedPost || null;
  const [formValue, setFormValue] = useState({
    title: editedPost?.title || "",
    content: editedPost?.content || "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({
    title: null,
    content: null,
    imageUrl: null,
  });
  const navigate = useNavigate();

  const handleChangeValue = (e) => {
    const { value, name } = e.target;

    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let errors = [];

    if (!formValue.title || formValue.title.length === 0) {
      errors.push("Title is required.");
    }
    if (!formValue.content || formValue.content.length === 0) {
      errors.push("Content is required.");
    }

    if ((!file || file?.size === 0) && !editedPost) {
      errors.push("Image is required.");
    }

    if (errors.length > 0) {
      return { errors };
    }

    let imageUrl;

    setIsLoading(true);

    if (file) {
      try {
        imageUrl = await uploadImage(file);
      } catch (error) {
        setIsLoading(false);
        throw new Error(
          "Image upload failed, post was not created. Please try again later."
        );
      }
    }

    const newPost = {
      ...formValue,
      imageUrl: imageUrl || editedPost?.imageUrl,
    };

    if (editedPost) {
      updatePost(newPost);
    } else {
      createPost(newPost);
    }
  };

  async function createPost(post) {
    const graphqlQuery = {
      query: `
      mutation{
      createPost(postInput: {title: "${post.title}", content:"${post.content}", imageUrl: "${post.imageUrl}"}){
        _id
        title
        content
        imageUrl
        createdAt
        updatedAt
       }
      }
      `,
    };

    try {
      await graphQlService.post(graphqlQuery);
      navigate(POSTS_ROUTE);
    } catch (error) {
      if (error.response.data.errors[0].status === 422) {
        const errorMsg = error.response.data.errors[0].data;

        setErrors({
          title: errorMsg[0]?.title || null,
          content: errorMsg[1]?.content || null,
          imageUrl: errorMsg[2]?.imageUrl || null,
        });
        return;
      }
      console.log(error);
      throw new Error("Post was not created. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  async function updatePost(post) {
    const graphqlQuery = {
      query: `
      mutation{
      updatePost(id: "${editedPost._id}", postInput: {title: "${post.title}", content:"${post.content}", imageUrl: "${post.imageUrl}"}){
        _id
        title
        content
        imageUrl
        createdAt
        updatedAt
       }
      }
      `,
    };

    try {
      await graphQlService.post(graphqlQuery);
      navigate(POSTS_ROUTE);
    } catch (error) {
      if (error.response.data.errors[0].status === 422) {
        const errorMsg = error.response.data.errors[0].data;

        setErrors({
          title: errorMsg[0]?.title || null,
          content: errorMsg[1]?.content || null,
          imageUrl: errorMsg[2]?.imageUrl || null,
        });
        return;
      }
      console.log(error);
      throw new Error("Post was not created. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={classes.compose}>
      <section className={classes.composeWrapper}>
        {(file || editedPost) && (
          <img
            className={classes.writeImg}
            src={file ? URL.createObjectURL(file) : editedPost?.imageUrl}
            alt="this is post cover"
          />
        )}
        <form className={classes.form} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="imageUrl">
              <span className={classes.writeFormIcon}>+</span>
            </label>
            <input
              type={"file"}
              id="imageUrl"
              style={{ display: "none" }}
              onChange={(event) => setFile(event.target.files[0])}
            />
            {errors && errors?.imageUrl && (
              <p className={classes.error}>{errors?.imageUrl}</p>
            )}
          </div>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formValue.title}
              onChange={handleChangeValue}
            />
            {errors && errors?.title && (
              <p className={classes.error}>{errors?.title}</p>
            )}
          </div>
          <div>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows="10"
              required
              value={formValue.content}
              onChange={handleChangeValue}
            ></textarea>
            {errors && errors?.content && (
              <p className={classes.error}>{errors?.content}</p>
            )}
          </div>
          <button
            className={classes.writeSubmit}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Publishing..." : "Publish"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Compose;
