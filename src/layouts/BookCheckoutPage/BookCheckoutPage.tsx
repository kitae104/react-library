import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import axios from "axios";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";

export const BookCheckoutPage: React.FC<{}> = () => {
  const [book, setBook] = useState<BookModel>(); // 책 정보
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 중
  const [httpError, setHttpError] = useState<string | null>(null); // 에러 메시지

  // Review State
  const [reviews, setReviews] = useState<ReviewModel[]>([]); // 리뷰 정보
  const [totalStars, setTotalStars] = useState<number>(0); // 총 별점
  const [isLoadingReview, setIsLoadingReview] = useState<boolean>(false); // 리뷰 로딩 중


  const bookId = window.location.pathname.split("/")[2]; // 책 ID

  //============================
  // 책 정보 가져오기
  //============================
  useEffect(() => {

    const fetchBook = async () => {
      setIsLoading(true);
      try {
        const baseUrl: string = `http://localhost/api/books/${bookId}`;

        const response = await axios.get(baseUrl);
        const book = response.data;

        const loadedBook: BookModel = {
          id: book.id,
          title: book.title,
          author: book.author,
          description: book.description,
          copies: book.copies,
          copiesAvailable: book.copiesAvailable,
          category: book.category,
          img: book.img,
        };

        setBook(loadedBook);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setHttpError("Something went wrong!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
    window.scrollTo(0, 0);
  }, []);

  //============================
  // 리뷰 정보 가져오기
  //============================
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoadingReview(true);
      console.log("AAAAAA");
      try {
        const reviewUrl: string = `http://localhost/api/reviews/search/findByBookId?bookId=${bookId}`;

        const response = await axios.get(reviewUrl);
        const responseData = response.data._embedded.reviews;
        // console.log(responseData);

        const loadedReviews: ReviewModel[] = [];
        let weightedStarReviews: number = 0;

        for (const key in responseData) {
          loadedReviews.push({
            id: responseData[key].id,
            userEmail: responseData[key].userEmail,
            date: responseData[key].date,
            rating: responseData[key].rating,
            book_id: responseData[key].book_id,
            reviewDescription: responseData[key].reviewDescription
          });
          weightedStarReviews += responseData[key].rating;
        }

        if (loadedReviews) {
          const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1); // 반올림
          setTotalStars(Number(round)); // 총 별점
        }
        setReviews(loadedReviews);
        setIsLoadingReview(false);

      } catch (error: any) {
        console.error(error);
        setHttpError(error.message);
      } finally {
        setIsLoadingReview(false);
      }
    }
    fetchReviews();
  }, []); 


  // 로딩 중일 때
  if (isLoading || isLoadingReview) {
    return <SpinnerLoading />;
  }

  // 에러가 발생한 경우
  if (httpError) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <p>{httpError}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ? (
              <img src={book?.img} width="226" height="349" alt="Book" />
            ) : (
              <img
                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                width="226"
                height="349"
                alt="Book"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox book={book} mobile={false} />
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
      </div>
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center align-items-center">
          {book?.img ? (
            <img src={book?.img} width="226" height="349" alt="Book" />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              width="226"
              height="349"
              alt="Book"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={4.5} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox book={book} mobile={true} />
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};
