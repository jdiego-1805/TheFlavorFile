import React from 'react';
import { useQuery } from '@apollo/client';
import "../styles/home.css"
import ThoughtForm from '../components/ThoughtForm';
import RecipePic from "../images/recipe-pic.jpg"
import { QUERY_THOUGHTS } from '../utils/queries';
import Auth from '../utils/auth';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { Navigate, useParams } from 'react-router-dom';

const Home = () => {
  return (
    <main>
      <div className="homeBox">
        <div className="circle">
          <div className='innercircle'>
            <p className="text">A moment on the lips, a lifetime on the hips</p>
            <img className='recipe-pic' src={RecipePic} alt='not working' />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
