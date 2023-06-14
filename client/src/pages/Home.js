import React from 'react';
import "../styles/home.css"
import RecipePic from "../images/recipe-pic.jpg"

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
