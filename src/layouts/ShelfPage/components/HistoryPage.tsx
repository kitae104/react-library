import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import HistoryModel from "../../../models/HistoryModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { Pagination } from "../../Utils/Pagination";

export const HistoryPage: React.FC<{}> = () => {

    const { authState } = useOktaAuth();    // Okta 인증 상태
    const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true); // 대출 기록 로딩 상태
    const [httpError, setHttpError] = useState<string | null>(null); // HTTP 에러

    // 기록 관리
    const [histories, setHistories] = useState<HistoryModel[]>([]);

    // 페이징 
    const [currentPage, setCurrentPage] = useState<number>(1);  // 현재 페이지
    const [totalPages, setTotalPages] = useState<number>(0);    // 전체 페이지

    useEffect(() => {
        const fetchUserHistories = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/histories/search/findBooksByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=5`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const historyResponse = await fetch(url, requestOptions);   // 대출 기록 가져오기
                if (!historyResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const historyResponseJson = await historyResponse.json();   // JSON으로 변환

                setHistories(historyResponseJson._embedded.histories);  // 대출 기록 설정
                setTotalPages(historyResponseJson.page.totalPages);     // 전체 페이지 설정
            }
            setIsLoadingHistory(false);
        };
        fetchUserHistories().catch((error: any) => {
            setIsLoadingHistory(false);
            setHttpError(error.message);
        });
    }, [authState, currentPage]);

    // 로딩 중일 때
    if (isLoadingHistory) {
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
            {histories.length > 0 ?
                <>
                    {/* 대출 이력이 있는 경우 */}
                    <h5>Recent History:</h5>
                    {histories.map(history => (
                        <div key={history.id}>
                            <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
                                {/* 하나의 행에 그림과 정보를 보여주기 */}
                                <div className='row g-0'>
                                    <div className='col-md-2'>
                                        {/* desktop */}
                                        <div className='d-none d-lg-block'>
                                            {history.img ?
                                                <img src={history.img} width='123' height='196' alt='Book' />
                                                :
                                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                                    width='123' height='196' alt='Default' />
                                            }
                                        </div>
                                        {/* mobile */}
                                        <div className='d-lg-none d-flex justify-content-center align-items-center'>
                                            {history.img ?
                                                <img src={history.img} width='123' height='196' alt='Book' />
                                                :
                                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                                    width='123' height='196' alt='Default' />
                                            }
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='card-body'>
                                            <h5 className='card-title'> {history.author} </h5>
                                            <h4>{history.title}</h4>
                                            <p className='card-text'>{history.description}</p>
                                            <hr />
                                            <p className='card-text'> Checked out on: {history.checkoutDate}</p>
                                            <p className='card-text'> Returned on: {history.returnedDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </div>
                    ))}
                </>
                :
                <>
                    {/* 대출 이역이 없는 경우 */}
                    <h3 className='mt-3'>Currently no history: </h3>
                    <Link className='btn btn-primary' to={'search'}>
                        Search for new book
                    </Link>
                </>
            }
            {/* 페이지 정보 보여주기 */}
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
};