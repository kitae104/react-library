import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { AdminMessage } from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";

export const AdminMessages: React.FC<{}> = () => {

    const { authState } = useOktaAuth();

    // 일반 로딩 
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);  // 메시지 로딩
    const [httpError, setHttpError] = useState<string | null>(null);    // HTTP 에러

    // Messages endpoint State
    const [messages, setMessages] = useState<MessageModel[]>([]);   // 메시지 목록
    const [messagesPerPage] = useState<number>(5);  // 한 페이지에 보여줄 메시지 수

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
    const [totalPages, setTotalPages] = useState(0);    // 전체 페이지

    // useEffect 다시 호출하기 
    const [btnSubmit, setBtnSubmit] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/messages/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const messagesResponse = await fetch(url, requestOptions);
                if (!messagesResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const messagesResponseJson = await messagesResponse.json();

                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            setIsLoadingMessages(false);
        }

        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        });
        window.scrollTo(0, 0);  // 페이지 맨 위로 이동
    }, [authState, currentPage, btnSubmit]);

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

    async function submitResponseToQuestion(id: number, response: string) {
        const url = `${process.env.REACT_APP_API}/messages/secure/admin/message`;
        if(authState && authState.isAuthenticated && id !== null && response !== '') {
            const messageAdminRequestModel: AdminMessageRequest = new AdminMessageRequest(id, response);
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageAdminRequestModel)
            };

            const messageAdminReqeustModelResponse = await fetch(url, requestOptions);
            if (!messageAdminReqeustModelResponse.ok) {
                throw new Error('Something went wrong!');
            }
            setBtnSubmit(!btnSubmit);
        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);    // 페이지 변경

    return (
        <div className='mt-3'>
            {messages.length > 0 ?
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                        <AdminMessage message={message} key={message.id} submitResponseToQuestion={submitResponseToQuestion} />
                    ))}
                </>
                :
                <h5>No Pending Q/A</h5>
            }


        </div>
    );
};