import React from "react";
import '../styles/profile.css'

const Profile = () => {
  return (
    <div>
      <div className="justify-center mb-3">
        <div className="big-container">
          <p className="profile-container">Create New Post<br></br><button>New+</button></p>
          <p className="profile-container">View Favorites<br></br><button>Favs</button></p>
        </div>
        <div>
          <p className="bottom-container">Most Recently Added</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
