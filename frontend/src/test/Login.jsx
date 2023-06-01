import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, deleteReview } from "../store/Slice/reviewsSlice";
import styles from "./Test.module.css";
import { customAlphabet } from "nanoid";
import LoadingCircle from "../Loading/LoadingCircle";
import Error from "../Loading/Error/Error";

export default function Test() {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.reviews);
  const loading = useSelector((state) => state.reviews.loading);
  const error = useSelector((state) => state.reviews.error);
  const nanoid = customAlphabet("1234567890", 10);
  const id = Number(nanoid(10));

  const token = process.env.REACT_APP_AUTH_TOKEN;
  
 
  const [reviewData, setReviewData] = useState({
    id: id,
    title: "",
    rating: "",
    body: "",
    img: "",
  });
  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);


  if (loading) {
    return <LoadingCircle />;
  }

  if (error) {
    return <div><Error error={error} /></div>;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReviewData((prevReviewData) => ({
      ...prevReviewData,
      [name]: value,
    }));
  };

    const handleDelete = (id, token) => {
      dispatch(deleteReview(id, token));
    };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:1337/api/reviews", {
      method: "POST",
      body: JSON.stringify({ data: reviewData }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  return (
    <div className={styles.test_container}>
      <div style={{ paddingTop: "12rem" }} />
      <div className={styles.test_block}>
        <div>
          <h1>Добавить пост</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={reviewData.title}
                onChange={handleChange}
              />
            </label>
            <label>
              Rating:
              <input
                type="number"
                name="rating"
                value={reviewData.rating}
                onChange={handleChange}
              />
            </label>
            <label>
              Body:
              <textarea
                name="body"
                value={reviewData.body}
                onChange={handleChange}
              />
            </label>
            <label>
              Image URL:
              <input
                type="text"
                name="img"
                value={reviewData.img}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
        <div>
          <h1>Все посты</h1>

          {reviews.map((element) => (
            <div key={element.id}>
              <ul>
                <li className={styles.test_item}>
                  <h2>{element.id }</h2>
                  <h3> title: {element.attributes.title}</h3>
                  <div> rating: {element.attributes.rating}</div>
                  <div>body: {element.attributes.body}</div>
                  <img
                    style={{ width: "300px" }}
                    src={element.attributes.img}
                    alt={element.attributes.img}
                  />
                  <button onClick={() => handleDelete(element.id)}>
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
