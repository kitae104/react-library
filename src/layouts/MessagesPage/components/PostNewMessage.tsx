import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

export const PostNewMessage: React.FC<{}> = () => {

    const { authState } = useOktaAuth();
    const [title, setTitle] = useState<string>('');
    const [question, setQuestion] = useState<string>('');
    const [displayWarning, setDisplayWarning] = useState<boolean>(false);
    const [displaySuccess, setDisplaySuccess] = useState<boolean>(false);

    async function submitNewQuestion() {
        const url = `http://localhost/api/messages/secure/add/message`;
        if (authState?.isAuthenticated && title !== '' && question !== '') {
            const messageRequestModel: MessageModel = new MessageModel(title, question);
            const requestOptions = {
                method: 'POST', // 메소드 설정
                headers: {      // 헤더 설정
                    'Authorization': `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageRequestModel)  // 객체를 문자열로 변환                
            };

            const submitNewQuestionResponse = await fetch(url, requestOptions);
            if (!submitNewQuestionResponse.ok) {
                throw new Error('Something went wrong!');
            }
            setTitle('');
            setQuestion('');
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return (
        <div className='card mt-3'>
            <div className='card-header'>
                Ask question to Kitae 2 Read Admin
            </div>
            <div className='card-body'>
                {/* 폼으로 처리 */}
                <form method='POST'>
                    {displayWarning &&
                        <div className='alert alert-danger' role='alert'>
                            All fields must be filled out
                        </div>
                    }
                    {displaySuccess &&
                        <div className='alert alert-success' role='alert'>
                            Question added successfully
                        </div>
                    }
                    <div className='mb-3'>
                        <label className='form-label'>
                            Title
                        </label>
                        <input type='text' className='form-control' id='exampleFormControlInput1'
                            placeholder='Title' onChange={e => setTitle(e.target.value)} value={title} />
                    </div>
                    <div className='mb-3'>
                        <label className='form-label'>
                            Question
                        </label>
                        <textarea className='form-control' id='exampleFormControlTextarea1'
                            rows={3} onChange={e => setQuestion(e.target.value)} value={question}>
                        </textarea>
                    </div>
                    <div>
                        <button type='button' className='btn btn-primary mt-3' onClick={submitNewQuestion}>
                            Submit Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};