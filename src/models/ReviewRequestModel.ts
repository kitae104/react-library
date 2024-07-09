// 리뷰 요청 모델
class ReviewRequestModel {
  rating: number; // 별점
  bookId: number; // 책 ID
  reviewDescription?: string; // 리뷰 내용

  constructor(rating: number, bookId: number, reviewDescription: string) {
    this.rating = rating;
    this.bookId = bookId;
    this.reviewDescription = reviewDescription;
  }
}

export default ReviewRequestModel;
