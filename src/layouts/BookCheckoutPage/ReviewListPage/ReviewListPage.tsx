import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { Review } from "../../Utils/Review";

export const ReviewListPage: React.FC<{}> = () => {

    const [reviews, setReviews] = useState<ReviewModel[]>([]);  // 리뷰 목록
    const [isLoading, setIsLoading] = useState<boolean>(true);  // 로딩 여부
    const [httpError, setHttpError] = useState<string | null>(null);  // 에러 메시지

    // 페이지 
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [reviewsPerPage] = useState<number>(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const bookId = (window.location.pathname).split('/')[2];

    //============================
    // 리뷰 정보 가져오기
    //============================
    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `http://localhost/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            setTotalAmountOfReviews(responseJsonReviews.page.totalElements);
            setTotalPages(responseJsonReviews.page.totalPages);

            const loadedReviews: ReviewModel[] = [];

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription,
                });
            }          

            setReviews(loadedReviews);
            setIsLoading(false);
        };

        fetchBookReviews().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage]);

    // 로딩 중일 때
    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    // 에러가 발생한 경우
    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    const indexOfLastReview: number = currentPage * reviewsPerPage;         // 마지막 리뷰
    const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;  // 첫 리뷰

    let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ?   // 마지막 아이템
            reviewsPerPage * currentPage : totalAmountOfReviews;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);    // 현재 페이지 설정

    return (
        <div className="container mt-5">
            <div>
                <h3>Comments: ({reviews.length})</h3>
            </div>
            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
            </p>
            <div className="row">
                {reviews.map(review => (
                    <Review review={review} key={review.id} />                    
                ))}
            </div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
};