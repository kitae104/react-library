class MessageModel {
    title: string;  // 질문 제목
    question: string;   // 질문 내용 
    id?: number; // 메시지 ID
    userEmail?: string; // 사용자 이메일
    adminEmail?: string; // 관리자 이메일
    response?: string; // 관리자 답변
    closed?: boolean;   // 답변 완료 여부

    constructor(title: string, question: string) {
        this.title = title;
        this.question = question;
    }
}

export default MessageModel;