import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/header.css"
import Auth from '../../utils/auth';

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header className="bg-primary text-light mb-4 py-3">
      <div className=" flex-row justify-space-between-lg justify-center align-center">
        <div>
          <Link className="text-light" to="/">
            <h1 className="m-0 title">The Flavor File</h1>
          </Link>
        </div>
        <div className='logButtons'>
          {Auth.loggedIn() ? (
            <>
              <Link className="btn btn-lg btn-logIn m-2" to="/me">
                {Auth.getProfile().data.username}'s profile
              </Link>
              <button className="btn btn-lg btn-logOut m-2" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-lg btn-logIn m-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-lg btn-logOut m-2" to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
