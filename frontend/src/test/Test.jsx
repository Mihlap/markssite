import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../store/Slice/reviewsSlice";
import styles from "./Test.module.css";

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
      <h1>Test Container</h1>
      {reviews.map((element) => (
        <ul key={element.id}>
          <li>
            <h3>{element.attributes.title}</h3>
            <div>{element.attributes.rating}</div>
            <div>{element.attributes.body}</div>
            <img style={{width: "400px"}} src={element.attributes.img} alt={ element.attributes.img} />
          </li>
        </ul>
      ))}
    </div>
  );
}
