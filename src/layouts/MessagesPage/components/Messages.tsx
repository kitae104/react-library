import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";

export const Messages: React.FC<{}> = () => {

    const { authState } = useOktaAuth();    // Okta 인증 상태
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);  // 메시지 로딩 상태
    const [httpError, setHttpError] = useState<string | null>(null); // HTTP 에러

    // 메시지 관리
    const [messages, setMessages] = useState<MessageModel[]>([]);

    // 페이징
    const [messagesPerPage] = useState<number>(5);  // 페이지 당 메시지 수
    const [currentPage, setCurrentPage] = useState<number>(1);  // 현재 페이지
    const [totalPages, setTotalPages] = useState<number>(0);    // 전체 페이지

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState && authState.isAuthenticated) {   // 인증 상태 확인
                const url = `${process.env.REACT_APP_API}/messages/search/findByUserEmail?userEmail=${authState?.accessToken?.claims.sub}&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {    // 요청 옵션
                    method: 'GET',  // 메소드 설정
                    headers: {  // 헤더 설정
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`, // 토큰 설정
                        'Content-Type': 'application/json'  // JSON 형식
                    }
                };
                const messagesResponse = await fetch(url, requestOptions);   // 대출 기록 가져오기
                if (!messagesResponse.ok) { // 에러 처리
                    throw new Error('Something went wrong!');
                }
                const messagesResponseJson = await messagesResponse.json();   // JSON으로 변환

                setMessages(messagesResponseJson._embedded.messages);  // 대출 기록 설정
                setTotalPages(messagesResponseJson.page.totalPages);     // 전체 페이지 설정
            }
            setIsLoadingMessages(false);    // 로딩 중지
        };
        fetchUserMessages().catch((error: any) => {    // 에러 처리
            setIsLoadingMessages(false);    // 로딩 중지
            setHttpError(error.message);    // 에러 메시지 설정
        });

        window.scrollTo(0, 0);  // 페이지 상단으로 이동

    }, [authState, currentPage]); // 의존성 배열

    // 로딩 중일 때
    if (isLoadingMessages) {
        return (
            <SpinnerLoading />
        );
    }

    // 에러가 발생한 경우 
    if (httpError) {
        return (
            <div className='container mt-5'>
                <div className='text-center'>
                    <p>{httpError}</p>
                </div>
            </div>
        );
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);    // 페이지 변경

    return (
        <div className='mt-2'>
            {messages.length > 0 ?
                <>
                    <h5>Current Q/A: </h5>
                    {/* 메시지 보여주기 */}
                    {messages.map(message => (
                        <div key={message.id}>
                            <div className='card mt-2 shadow p-3 bg-body rounded'>
                                <h5>Case #{message.id}: {message.title}</h5>
                                <h6>{message.userEmail}</h6>
                                <p>{message.question}</p>
                                <hr />
                                <div>
                                    <h5>Response: </h5>
                                    {message.response && message.adminEmail ?
                                        <>
                                            <h6>{message.adminEmail} (admin)</h6>
                                            <p>{message.response}</p>
                                        </>
                                        :
                                        <p><i>Pending response from administration. Please be patient.</i></p>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </>
                :
                <h5>All questions you submit will be shown here</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
};