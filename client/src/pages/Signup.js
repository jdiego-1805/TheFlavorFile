import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/signup.css"
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import { PersonCircle, PCircleFill, EnvelopeAtFill } from "react-bootstrap-icons"

import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex-row justify-center mainBox ">
      <div className="col-12  innerBox">
        <div className="card">
          <h4 className="card-header loginHeader text-light p-2">Sign up</h4>
          <div className="card-body">
            {data ? (
              <p>
                Success! You may now head{' '}
                <Link to="/">back to the homepage.</Link>
              </p>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <PersonCircle size={60} className='signupUsernameIcon' />
                <input
                  className="form-input innerInput"
                  placeholder="Your username"
                  name="username"
                  type="text"
                  value={formState.name}
                  onChange={handleChange}
                />
                <EnvelopeAtFill size={60} className='signupEmailIcon' />
                <input
                  className="form-input passwordInput"
                  placeholder="Your email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                />
                <PCircleFill size={60} className='signupPasswordIcon' />
                <input
                  className="form-input innerInput"
                  placeholder="******"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                />
                <button
                  className="btn btn-block loginSubmit"
                  style={{ cursor: 'pointer' }}
                  type="submit"
                >
                  Submit
                </button>
              </form>
            )}

            {error && (
              <div className="my-3 p-3 bg-danger text-white">
                {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
