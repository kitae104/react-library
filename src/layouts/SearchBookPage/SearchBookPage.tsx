import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import axios from "axios";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../Utils/Pagination";


export const SearchBookPage: React.FC<{}> = () => {

    const [books, setBooks] = useState<BookModel[]>([]);    // 책 정보
    const [isLoading, setIsLoading] = useState<boolean>(true);  // 로딩 중
    const [httpError, setHttpError] = useState<string | null>(null);    // 에러 메시지
    const [currentPage, setCurrentPage] = useState<number>(1);  // 현재 페이지
    const [booksPerPage] = useState<number>(5); // 한 페이지에 보여줄 책의 수
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState<number>(0); // 전체 책의 수
    const [totalPages, setTotalPages] = useState<number>(0); // 전체 페이지 수
    const [search, setSearch] = useState<string>(''); // 검색어
    const [searchUrl, setSearchUrl] = useState<string>(''); // 검색 URL
    const [categorySelection, setCategorySelection] = useState<string>('Book category'); // 카테고리 선택

    useEffect(() => {
        // 책정보 가져오기
        const fetchBooks = async () => {
            setIsLoading(true);

            try {
                const baseUrl: string = `${process.env.REACT_APP_API}/books`;
                let url: string = '';

                if (searchUrl === '') {
                    url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
                } else {
                    let serachWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);
                    url = baseUrl + serachWithPage;
                }

                const response = await axios.get(url);
                const responseData = response.data._embedded.books;

                setTotalAmountOfBooks(response.data.page.totalElements);
                setTotalPages(response.data.page.totalPages);

                const loadedBooks: BookModel[] = [];
                for (const book of responseData) {
                    loadedBooks.push({
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        description: book.description,
                        copies: book.copies,
                        copiesAvailable: book.copiesAvailable,
                        category: book.category,
                        img: book.img,
                    });
                }
                setBooks(loadedBooks);
            } catch (error) {
                console.error(error);
                setHttpError('Something went wrong!');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBooks();
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

    // 로딩 중일 때
    if (isLoading) {
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

    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`);
        }
        setCategorySelection('Book category');
    }

    const categoryField = (value: string) => {
        setCurrentPage(1);
        if(value.toLowerCase() === 'fe' ||
           value.toLowerCase() === 'be' ||
           value.toLowerCase() === 'data' ||
           value.toLowerCase() === 'devops'        
        ) {
            setCategorySelection(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`);
        } else {
            setCategorySelection('All');
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`);
        }
    }

    const indexOfLastBook: number = currentPage * booksPerPage; // 마지막 책의 인덱스
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage; // 첫번째 책의 인덱스
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ?
        booksPerPage * currentPage : totalAmountOfBooks; // 마지막 아이템

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <div className="container">
                <div>
                    <div className='row mt-5'>
                        <div className='col-6'>
                            <div className='d-flex'>
                                <input type="search" className="form-control me-2" placeholder="Search"
                                    aria-labelledby="Search" onChange={e => setSearch(e.target.value)} />
                                <button className="btn btn-outline-success" onClick={() => searchHandleChange()}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='dropdown'>
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    {categorySelection}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li onClick={() => categoryField('All')}>
                                        <a className="dropdown-item" href="#">
                                            ALL
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('FE')}>
                                        <a className="dropdown-item" href="#">
                                            Front End
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('BE')}>
                                        <a className="dropdown-item" href="#">
                                            Back End
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Data')}>
                                        <a className="dropdown-item" href="#">
                                            Data
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Devops')}>
                                        <a className="dropdown-item" href="#">
                                            DevOps
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {totalAmountOfBooks > 0 ?
                        <>
                            <div className='mt-3'>
                                <h5>Number of results: ({totalAmountOfBooks})</h5>
                            </div>
                            <p>
                                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                            </p>
                            {books.map(book => (
                                <SearchBook book={book} key={book.id} />
                            ))}
                        </>
                        :
                        <div className='m-5'>
                            <h3>
                                Can't find what you are looking for?
                            </h3>
                            <a type='button' className='btn main-color btn-md px-4 me-md-2 fw-bold text-white'
                                href='#'>Library Services</a>
                        </div>
                    }
                    {totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    }
                </div>
            </div>
        </div>
    );
};