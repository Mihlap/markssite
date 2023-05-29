import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../store/Slice/reviewsSlice";
import styles from "./Test.module.css";
import LoadingCircle from "../Loading/LoadingCircle";

export default function Test() {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.reviews);
  const loading = useSelector((state) => state.reviews.loading);
  const error = useSelector((state) => state.reviews.error);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log(reviews);

  return (
    <div className={styles.test_container}>
      <div style={{ paddingTop: "12rem" }} />
      <div className={styles.test_block}>
        <div>
          <h1>Добавить пост</h1>
          <font className={styles.test_form}>
            <input type="text" placeholder="title" />
            <input type="number" name="" id="" placeholder="rating" />
            <input type="text" placeholder="body" />
            <button>отправить </button>
          </font>
        </div>
        <div>
          <h1>Все посты</h1>

          {reviews.map((element) => (
            <div key={element.id}>
              <ul>
                <li className={styles.test_item}>
                  <h3> title: {element.attributes.title}</h3>
                  <div> rating: {element.attributes.rating}</div>
                  <div>body: {element.attributes.body}</div>
                  <img
                    style={{ width: "400px" }}
                    src={element.attributes.img}
                    alt={element.attributes.img}
                  />
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
