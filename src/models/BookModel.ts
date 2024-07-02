// 책 정보를 관리하는 모델 클래스
class BookModel {
  id: number; // 책 ID
  title: string; // 책 제목
  author?: string; // 저자
  description?: string; // 책 설명
  copies?: number; // 전체 책 수량
  copiesAvailable?: number; // 대출 가능한 책 수량
  category?: string; // 책 카테고리
  img?: string; // 책 이미지 URL

  constructor(
    id: number,
    title: string,
    author: string,
    description: string,
    copies: number,
    copiesAvailable: number,
    category: string,
    img: string
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.description = description;
    this.copies = copies;
    this.copiesAvailable = copiesAvailable;
    this.category = category;
    this.img = img;
  }
}

export default BookModel;
