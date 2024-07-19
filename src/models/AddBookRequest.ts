class AddBookRequest {
  title: string; // 책 제목
  author: string; // 저자
  description: string; // 설명
  copies: number; // 복사본 수
  category: string; // 카테고리
  img?: string; // 이미지

  constructor(
    title: string,
    author: string,
    description: string,
    copies: number,
    category: string
  ) {
    this.title = title;
    this.author = author;
    this.description = description;
    this.copies = copies;
    this.category = category;
  }
}

export default AddBookRequest;
