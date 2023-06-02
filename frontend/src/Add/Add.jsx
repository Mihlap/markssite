import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, deleteReview } from "../store/Slice/reviewsSlice";
import styles from "./Add.module.scss";
import { customAlphabet } from "nanoid";
import LoadingCircle from "../Loading/LoadingCircle";
import Error from "../Loading/Error/Error";

export default function Add({ user }) {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.reviews);
  const loading = useSelector((state) => state.reviews.loading);
  const error = useSelector((state) => state.reviews.error);
  const nanoid = customAlphabet("1234567890", 10);
  const id = Number(nanoid(10));

  const token = process.env.REACT_APP_AUTH_TOKEN;
  const [isOpen, setIsOpen] = useState(false);
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

  console.log(reviews);

  if (loading) {
    return <LoadingCircle />;
  }

  if (error) {
    return (
      <div>
        <Error error={error} />
      </div>
    );
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
      .then((data) => {
        console.log(data);
        dispatch(fetchReviews()); // dispatch action to update the Redux store
      })
      .catch((error) => console.error(error));
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.add_container}>
      <div style={{ paddingTop: "8rem" }} />
      <div className={styles.add_container__userName}>
        Привет {user.username} 👋
      </div>
      <div className={styles.add_container__block}>
        <div className={styles.add_container__button_blocks}>
          <button
            className={styles.add_container__articles_button}
            onClick={openModal}
          >
            Добавить Публикацию
          </button>
          {isOpen && (
            <div className={styles.add_container__modal_overlay}>
              <div className={styles.add_container__modal}>
                <span
                  className={styles.add_container__close}
                  onClick={closeModal}
                >
                  &times;
                </span>
                <div className={styles.add_container__form_title}>
                  Добавить публикацию
                </div>
                <form
                  className={styles.add_container__form_articles}
                  onSubmit={handleSubmit}
                >
                  <label>
                    Заголовок
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
                  <button type="submit">Опубликовать</button>
                </form>
              </div>
            </div>
          )}
          <button
            className={styles.add_container__project_button}
            onClick={openModal}
          >
            Добавить Проект
          </button>
        </div>
        <div className={styles.add_container__list_block}>
          <div className={styles.add_container__articles_container}>
            <div className={styles.add_container__list_title}>
              Все Публикации
            </div>
            {reviews.map((element) => (
              <div key={element.id}>
                <ul>
                  <li className={styles.add_container__item_articles}>
                    <div className={styles.add_container__item_title}>
                      {element.attributes.title}
                    </div>
                    <img
                      className={styles.add_container__img_articles}
                      src={element.attributes.img}
                      alt={element.attributes.img}
                    />
                    <button
                      className={styles.add_container__item_buttom_del}
                      onClick={() => handleDelete(element.id)}
                    >
                      <label for="delete" className={styles.label}>
                        <div className={`${styles.wrapper}`}>
                          <div className={`${styles.lid}`}></div>
                          <div className={`${styles.can}`}></div>
                          <span>delete</span>
                        </div>
                      </label>
                    </button>
                  </li>
                </ul>
              </div>
            ))}
          </div>
          <div className={styles.add_container__project_container}>
            <div className={styles.add_container__list_title}>Все Проекты</div>
            <div>
              <ul>
                <li className={styles.add_container__item_articles}>
                  <div className={styles.add_container__item_title}>
                    Lorem ipsum dolor sit amet.
                  </div>
                  <img
                    className={styles.add_container__img_articles}
                    alt="img"
                  />
                  <button className={styles.add_container__item_buttom_del}>
                    <label for="delete" className={styles.label}>
                      <div className={`${styles.wrapper}`}>
                        <div className={`${styles.lid}`}></div>
                        <div className={`${styles.can}`}></div>
                        <span>delete</span>
                      </div>
                    </label>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
