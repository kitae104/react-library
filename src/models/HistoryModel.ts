class HistoryModel {
  id: number; // 책 아이디
  userEmail: string; // 사용자 이메일
  checkoutDate: string; // 대출일
  returnedDate: string; // 반납일
  title: string; // 책 제목
  author: string; // 저자
  description: string; // 책 설명
  img: string; // 책 이미지

  constructor(
    id: number,
    userEmail: string,
    checkoutDate: string,
    returnedDate: string,
    title: string,
    author: string,
    description: string,
    img: string
  ) {
    this.id = id;
    this.userEmail = userEmail;
    this.checkoutDate = checkoutDate;
    this.returnedDate = returnedDate;
    this.title = title;
    this.author = author;
    this.description = description;
    this.img = img;
  }
}

export default HistoryModel;
