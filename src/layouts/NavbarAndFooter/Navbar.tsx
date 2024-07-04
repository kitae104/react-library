import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { ok } from 'assert';

export const Navbar: React.FC<{}> = () => {

    const { oktaAuth, authState } = useOktaAuth();      // oktaAuth 인스턴스와 authState 객체를 반환

    if( !authState) {
        return <SpinnerLoading />
    }

    const handleLogout = async () => oktaAuth.signOut();    // 로그아웃 처리

    console.log(authState);

    return (
        <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
            <div className='container-fluid'>                
                <Link to="/" className="navbar-brand">Kitae</Link>
                <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
                    aria-controls='navbarNavDropdown' aria-expanded='false' aria-label='Toggle Navigation'>
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNavDropdown'>
                    <ul className='navbar-nav'>
                        <li className='nav-item'>
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className='nav-item'>
                            <Link to="/search" className="nav-link">Search Books</Link>
                        </li>
                    </ul>

                    {/* 인증 여부에 따라 로그인과 로그 아웃 처리 */}
                    <ul className='navbar-nav ms-auto'>
                        {!authState.isAuthenticated ? 
                            <li className='nav-item m-1'>
                                <Link type='button' className='btn btn-outline-light' to='/login'>Sign in</Link>
                            </li>
                            :
                            <li>
                                <button type='button' className='btn btn-outline-light' onClick={handleLogout}>Logout</button>
                            </li>

                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
};