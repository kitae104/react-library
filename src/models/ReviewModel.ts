// 리뷰 정보를 담는 ReviewModel 클래스를 정의
class ReviewModel {
  id: number; // 리뷰 ID
  userEmail: string; // 이메일
  date: string; // 리뷰 작성일
  rating: number; // 평점
  book_id: number; // 책 ID
  reviewDescription?: string; // 리뷰 내용 - 선택적 속성

  constructor(
    id: number,
    userEmail: string,
    date: string,
    rating: number,
    book_id: number,
    reviewDescription: string
  ) {
    this.id = id;
    this.userEmail = userEmail;
    this.date = date;
    this.rating = rating;
    this.book_id = book_id;
    this.reviewDescription = reviewDescription;
  }
}

export default ReviewModel;
