import React from 'react';
import { useQuery } from '@apollo/client';
import "../styles/home.css"
import ThoughtForm from '../components/ThoughtForm';
import RecipePic from "../images/recipe-pic.jpg"
import { QUERY_THOUGHTS } from '../utils/queries';

const Home = () => {
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  const thoughts = data?.thoughts || [];

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
