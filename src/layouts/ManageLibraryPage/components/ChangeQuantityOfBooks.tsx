import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { ChangeQuantityOfBook } from "./ChangeQuantityOfBook";

export const ChangeQuantityOfBooks: React.FC<{}> = () => {

    const [books, setBooks] = useState<BookModel[]>([]);    // 책 정보
    const [isLoading, setIsLoading] = useState<boolean>(true);  // 로딩 중
    const [httpError, setHttpError] = useState<string | null>(null);    // 에러 메시지
    const [currentPage, setCurrentPage] = useState<number>(1);  // 현재 페이지
    const [booksPerPage] = useState<number>(5); // 한 페이지에 보여줄 책의 수
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState<number>(0); // 전체 책의 수
    const [totalPages, setTotalPages] = useState<number>(0); // 전체 페이지 수

    const [bookDelete, setBookDelete] = useState<boolean>(false); // 삭제할 책 정보

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `http://localhost/api/books?page=${currentPage - 1}&size=${booksPerPage}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.books;

            setTotalAmountOfBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            const loadedBooks: BookModel[] = [];

            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }

            setBooks(loadedBooks);
            setIsLoading(false);
        };

        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage, bookDelete]);

    // 로딩 중일 때
    if (isLoading) {
        return (
            <SpinnerLoading />
        );
    }

    const indexOfLastBook: number = currentPage * booksPerPage; // 마지막 책의 인덱스
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage; // 첫번째 책의 인덱스
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ?
        booksPerPage * currentPage : totalAmountOfBooks; // 마지막 아이템

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const deleteBook = () => {
        setBookDelete(!bookDelete);
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

    return (
        <div className='container mt-5'>
            {totalAmountOfBooks > 0 ? 
                <>
                    <div className="mt-3">
                        <h3>Number of results : ({totalAmountOfBooks})</h3>
                    </div>
                    <p>
                        {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items: 
                    </p>
                    {books.map(book => (
                        <ChangeQuantityOfBook key={book.id} book={book} deleteBook={deleteBook}/>
                    ))}
                </>
                :
                <h5>Add a book before changing quantity</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
};