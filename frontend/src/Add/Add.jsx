import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, deleteReview } from "../store/Slice/reviewsSlice";
import { fetchArticles } from "../store/Slice/articlesSlice";
import styles from "./Add.module.scss";
import { customAlphabet } from "nanoid";
import LoadingCircle from "../Loading/LoadingCircle";
import Error from "../Loading/Error/Error";
import { fetchProject } from "../store/Slice/projectSlice";
import AddNavbar from "./add-navbar/AddNavbar";
import { Route, Routes } from "react-router-dom";
import HomeAdmin from "./HomeAdmin";
import AddProject from "./add-project/AddProject";
import AddArticles from "./add-articles/AddArticles";
import AddCompany from "./add-about-the-company/AddCompany";


export default function Add({ user, setNavBarOpen, setShowFooter }) {

  const dispatch = useDispatch();
  // const reviews = useSelector((state) => state.reviews.reviews);
  // const artickes = useSelector((state) => state.articles.articles);
  // const project = useSelector((state) => state.project.articles);
  // const loading = useSelector((state) => state.reviews.loading);
  // const error = useSelector((state) => state.reviews.error);
  const nanoid = customAlphabet("1234567890", 10);
  const id = Number(nanoid(10));

  const token = user.jwt;
  localStorage.setItem("token", token);

  const tokens = localStorage.getItem("token");

  // console.log(token, "<<---TOKEN");
  const [isOpen, setIsOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    id: id,
    title: "",
    rating: "",
    body: "",
    photos: "",
  });


  useEffect(() => {
    function handleHideElements() {
      setNavBarOpen(false);
      setShowFooter(false);
    }
    handleHideElements();
  }, []);

  //  useEffect(() => {
  //    return () => {
  //      setNavBarOpen(true);
  //      setShowFooter(true);
  //    };
  //  }, [setNavBarOpen, setShowFooter]);

  useEffect(() => {
    dispatch(fetchReviews());
    dispatch(fetchArticles());
    dispatch(fetchProject());
  }, [dispatch]);

  // if (loading) {
  //   return <LoadingCircle />;
  // }

  // if (error) {
  //   return (
  //     <div>
  //       <Error error={error} />
  //     </div>
  //   );
  // }

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

const handlePhotoChange = (event) => {
  const file = event.target.files[0];
  setReviewData((prevReviewData) => ({
    ...prevReviewData,
    photos: file,
  }));
  console.log(file);
};

  
const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append("files.photos", reviewData.photos); // Обратите внимание на изменение здесь
  formData.append("data", JSON.stringify(reviewData));

  console.log(formData, "<----FORM_DATA");

   fetch("http://localhost:1337/api/reviews", {
  method: "POST",
  body: formData,
  headers: {
    Authorization: `Bearer ${tokens}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    // Здесь вы можете получить доступ к данным о фотографии и другим данным
    const { photos, ...restData } = data;
    console.log("Данные о фотографии:", photos);
    console.log("Остальные данные:", restData);
    
    dispatch(fetchReviews());
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

// console.log(reviews.map((el) => el.attributes));
return (
  <div className={styles.add_container}>
      <AddNavbar />
      <Routes>
        <Route path="/" element={<HomeAdmin />} />
        <Route path="add-a-project" element={<AddProject />} />
        <Route path="add-a-articles" element={<AddArticles />} />
        <Route path="add-a-company" element={<AddCompany />} />
      </Routes>

      {/* <div style={{ paddingTop: "8rem" }} />
      <div className={styles.add_container__userName}>
      </div> */}
      {/* <div className={styles.add_container__block}> */}
      {/* <div className={styles.add_container__button_blocks}> */}
      {/* <button
        className={styles.add_container__articles_button}
        onClick={openModal}
      >
        Добавить Публикацию
      </button> */}
      {isOpen && (
        <div className={styles.add_container__modal_overlay}>
          <div className={styles.add_container__modal}>
            <span className={styles.add_container__close} onClick={closeModal}>
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
                Фотография:
                <input type="file" name="photo" onChange={handlePhotoChange} />
              </label>
              <button
                className={styles.add_container__publish_button}
                type="submit"
              >
                Опубликовать
              </button>
            </form>
          </div>
        </div>
      )}
      {/*
        </div>
        <div className={styles.add_container__list_block}>
          <div className={styles.add_container__articles_container}>
            <div className={styles.add_container__list_title}>
              Все Публикации 🗂️
            </div>
             <ul>
              {artickes &&
                artickes.map((element) => (
                  <li
                    key={element.id}
                    className={styles.add_container__item_articles}
                  >
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
                      <label htmlfor="delete" className={styles.label}>
                        <div className={`${styles.wrapper}`}>
                          <div className={`${styles.lid}`}></div>
                          <div className={`${styles.can}`}></div>
                          <span>delete</span>
                        </div>
                      </label>
                    </button>
                  </li>
                ))}
            </ul>
                */}
      {/* <ul>
        {reviews &&
          reviews.map((element) => (
            <li
              key={element.id}
              className={styles.add_container__item_articles}
            >
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
                <label htmlfor="delete" className={styles.label}>
                  <div className={`${styles.wrapper}`}>
                    <div className={`${styles.lid}`}></div>
                    <div className={`${styles.can}`}></div>
                    <span>delete</span>
                  </div>
                </label>
              </button>
            </li>
          ))}
      </ul> */}
      {/*
          </div>
          <div className={styles.add_container__project_container}>
            <div className={styles.add_container__list_title}>
              Все Проекты 🏠
            </div>
            <ul>
              {project &&
                project.map((element) => (
                  <li
                    key={element.id}
                    className={styles.add_container__item_articles}
                  >
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
                      <label htmlfor="delete" className={styles.label}>
                        <div className={`${styles.wrapper}`}>
                          <div className={`${styles.lid}`}></div>
                          <div className={`${styles.can}`}></div>
                          <span>delete</span>
                        </div>
                      </label>
                    </button>
                  </li>
                ))}
            </ul> 
          </div>
        </div>
      </div> */}
    </div>
  );
}
