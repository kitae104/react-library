import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage: React.FC<{}> = () => {

  const { authState } = useOktaAuth(); // Okta 인증 상태

  const [book, setBook] = useState<BookModel>(); // 책 정보
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 중
  const [httpError, setHttpError] = useState<string | null>(null); // 에러 메시지

  // 리뷰 상태 
  const [reviews, setReviews] = useState<ReviewModel[]>([]); // 리뷰 정보
  const [totalStars, setTotalStars] = useState<number>(0); // 총 별점
  const [isLoadingReview, setIsLoadingReview] = useState<boolean>(true); // 리뷰 로딩 중

  const [isReviewLeft, setIsReviewLeft] = useState<boolean>(false); // 리뷰 작성 여부 [true: 리뷰 작성 가능, false: 리뷰 작성 불가능
  const [isLoadingUserReview, setIsLoadingUserReview] = useState<boolean>(true); // 리뷰 작성 여부 로딩 중

  // 대여 숫자 상태 
  const [currentLoansCount, setCurrentLoansCount] = useState<number>(0); // 현재 대여 중인 책 수
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState<boolean>(true); // 대여 숫자 로딩 중

  // 책 대출 여부 확인 
  const [isCheckedOut, setIsCheckedOut] = useState<boolean>(false); // 대출 여부 [true: 대출 가능, false: 대출 불가능
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState<boolean>(true); // 대출 여부 로딩 중


  const bookId = (window.location.pathname).split("/")[2]; // 책 ID

  //============================
  // 책 정보 가져오기
  //============================
  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl: string = `${process.env.REACT_APP_API}/books/${bookId}`;

      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const responseJson = await response.json();

      const loadedBook: BookModel = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        img: responseJson.img,
      };

      setBook(loadedBook);
      setIsLoading(false);
    };
    fetchBook().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    })
  }, [isCheckedOut]);

  //============================
  // 리뷰 정보 가져오기
  //============================
  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;

      const responseReviews = await fetch(reviewUrl);

      if (!responseReviews.ok) {
        throw new Error('Something went wrong!');
      }

      const responseJsonReviews = await responseReviews.json();

      const responseData = responseJsonReviews._embedded.reviews;

      const loadedReviews: ReviewModel[] = [];

      let weightedStarReviews: number = 0;

      for (const key in responseData) {
        loadedReviews.push({
          id: responseData[key].id,
          userEmail: responseData[key].userEmail,
          date: responseData[key].date,
          rating: responseData[key].rating,
          book_id: responseData[key].bookId,
          reviewDescription: responseData[key].reviewDescription,
        });
        weightedStarReviews = weightedStarReviews + responseData[key].rating;
      }

      if (loadedReviews) {
        const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
        setTotalStars(Number(round));
      }

      setReviews(loadedReviews);
      setIsLoadingReview(false);
    };

    fetchBookReviews().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    })
  }, [isReviewLeft]);

  //============================
  // 유저 리뷰 여부 가져오기
  //============================
  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json'
          }
        };
        const userReview = await fetch(url, requestOptions);
        if (!userReview.ok) {
          throw new Error('Something went wrong');
        }
        const userReviewResponseJson = await userReview.json();
        setIsReviewLeft(userReviewResponseJson);
      }
      setIsLoadingUserReview(false);
    }
    fetchUserReviewBook().catch((error: any) => {
      setIsLoadingUserReview(false);
      setHttpError(error.message);
    })
  }, [authState]);

  //============================
  // 대여 숫자 가져오기
  //============================
  useEffect(() => {
    const fetchUserCurrentLoansCount = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json'
          }
        };
        const currentLoansCountResponse = await fetch(url, requestOptions);
        if (!currentLoansCountResponse.ok) {
          throw new Error('Something went wrong!');
        }
        const currentLoansCountResponseJson = await currentLoansCountResponse.json();
        setCurrentLoansCount(currentLoansCountResponseJson);
      }
      setIsLoadingCurrentLoansCount(false);
    }
    fetchUserCurrentLoansCount().catch((error: any) => {
      setIsLoadingCurrentLoansCount(false);
      setHttpError(error.message);
    })
  }, [authState, isCheckedOut]);

  //============================
  // 책 대출 여부 가져오기
  //============================
  useEffect(() => {
    const fetchUserCheckedOutBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/ischeckout/byuser?bookId=${bookId}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json'
          }
        };
        const bookCheckedOut = await fetch(url, requestOptions);

        if (!bookCheckedOut.ok) {
          throw new Error('Something went wrong!');
        }

        const bookCheckedOutResponseJson = await bookCheckedOut.json();

        setIsCheckedOut(bookCheckedOutResponseJson);
      }
      setIsLoadingBookCheckedOut(false);
    }
    fetchUserCheckedOutBook().catch((error: any) => {
      setIsLoadingBookCheckedOut(false);
      setHttpError(error.message);
    })
  }, [authState]);


  // 로딩 중일 때
  if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
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

  //============================
  // 책 대출하기
  //============================
  async function checkoutBook() {
    const url = `${process.env.REACT_APP_API}/books/secure/checkout?bookId=${book?.id}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
      }
    };
    const checkoutResponse = await fetch(url, requestOptions);
    if (!checkoutResponse.ok) {
      throw new Error('Something went wrong!');
    }
    setIsCheckedOut(true);
  }

  //============================
  // 리뷰 제출하기
  //============================
  async function submitReview(startInput: number, reviewDescription: string) {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }

    const reviewRequestModel = new ReviewRequestModel(startInput, bookId, reviewDescription); // 리뷰 요청 모델
    const url = `${process.env.REACT_APP_API}/reviews/secure`;
    const requestOptions = {
      method: 'POST',
      headers: {        
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewRequestModel)   // 리뷰 요청 모델을 JSON 문자열로 변환      
    };

    const returnResponse = await fetch(url, requestOptions);
    if (!returnResponse.ok) {
      throw new Error('Something went wrong!');
    }
    setIsReviewLeft(true);
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
          <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount}
            isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut}
            checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview} />
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
        <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount}
          isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut}
          checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview} />
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};
