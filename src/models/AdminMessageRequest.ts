// 관리자 메시지 응답 요청 모델
class AdminMessageRequest {
  id: number;
  response: string;

  constructor(id: number, response: string) {
    this.id = id;
    this.response = response;
  }
}

export default AdminMessageRequest;
