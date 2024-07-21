import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import AddBookRequest from "../../../models/AddBookRequest";

export const AddNewBook: React.FC<{}> = () => {

    const { authState } = useOktaAuth();

    // 새 책 
    const [title, setTitle] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [copies, setCopies] = useState<number>(0);
    const [category, setCategory] = useState<string>('Category');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // 보이기 
    const [displayWarning, setDisplayWarning] = useState<boolean>(false);
    const [displaySuccess, setDisplaySuccess] = useState<boolean>(false);

    function categoryField(value: string) {
        setCategory(value);
    }

    async function base64ConversionForImage(e: any) {
        if (e.target.files[0]) {             // 파일이 선택되었는지 확인
            getBase64(e.target.files[0]);   // 파일을 base64로 변환
        }
    }

    function getBase64(file: any) {
        let reader = new FileReader();  // 파일을 읽기 위한 FileReader 객체 생성
        reader.readAsDataURL(file);     // 파일을 읽어 dataURL 형식의 문자열로 저장
        reader.onload = () => {         // 파일 읽기가 완료되면 호출
            setSelectedImage(reader.result);    // 파일 내용을 저장
        };
        reader.onerror = (error) => {   // 파일 읽기 도중 에러가 발생하면 호출
            console.log('Error: ', error);  // 에러 출력
        }
    }

    async function submitNewBook() {
        const url = `${process.env.REACT_APP_API}/admin/secure/add/book`;
        if (authState?.isAuthenticated && title !== '' && author !== '' && category !== 'Category'
            && description !== '' && copies > 0) {
            const book: AddBookRequest = new AddBookRequest(title, author, description, copies, category);  // 새 책 생성
            book.img = selectedImage;   // 이미지 추가
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),     // 새 책을 JSON 문자열로 변환
            };

            const submitNewBookResponse = await fetch(url, requestOptions); // 새 책을 서버로 전송
            if (submitNewBookResponse.ok) {
                throw new Error('Something went wrong!');
            }
            // 새 책이 성공적으로 추가되면 필드를 비움
            setTitle('');
            setAuthor('');
            setDescription('');
            setCopies(0);
            setCategory('Category');
            setSelectedImage(null);
            setDisplaySuccess(true);
            setDisplayWarning(false);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return (
        <div className='container mt-5 mb-5'>
            {displaySuccess &&
                <div className='alert alert-success' role='alert'>
                    Book added successfully
                </div>
            }
            {displayWarning &&
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out
                </div>
            }
            <div className='card'>
                <div className='card-header'>
                    Add a new book
                </div>
                <div className='card-body'>
                    <form method='POST'>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Title</label>
                                <input type="text" className='form-control' name='title' required
                                    onChange={e => setTitle(e.target.value)} value={title} />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Author </label>
                                <input type="text" className='form-control' name='author' required
                                    onChange={e => setAuthor(e.target.value)} value={author} />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Category</label>
                                <button className='form-control btn btn-secondary dropdown-toggle' type='button'
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                    {category}
                                </button>
                                <ul id='addNewBookId' className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li><a onClick={() => categoryField('FE')} className='dropdown-item'>Front End</a></li>
                                    <li><a onClick={() => categoryField('BE')} className='dropdown-item'>Back End</a></li>
                                    <li><a onClick={() => categoryField('Data')} className='dropdown-item'>Data</a></li>
                                    <li><a onClick={() => categoryField('DevOps')} className='dropdown-item'>DevOps</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-md-12 mb-3'>
                            <label className='form-label'>Description</label>
                            <textarea className='form-control' id='exampleFormControlTextarea1' rows={3}
                                onChange={e => setDescription(e.target.value)} value={description}></textarea>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <label className='form-label'>Copies</label>
                            <input type='number' className='form-control' name='Copies' required
                                onChange={e => setCopies(Number(e.target.value))} value={copies} />
                        </div>
                        <input type='file' onChange={e => base64ConversionForImage(e)} />
                        <div>
                            <button type='button' className='btn btn-primary mt-3' onClick={submitNewBook}>
                                Add Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};