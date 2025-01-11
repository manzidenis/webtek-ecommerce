/* eslint-disable jsx-a11y/alt-text */
// import logo from './logo.svg';
import userImg from '../img/user.png';
import order from '../img/order.png';
import logout from '../img/log-out.png';
import './DropDownMenu.css';
import ProfileItem from './ProfileItems';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/userSlice';


import React, {useState, useEffect, useRef} from 'react';

function Profile() {

  const [open, setOpen] = useState(false);
  const user = useSelector(selectUser);
  console.log(user);

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e)=>{
      if(!menuRef.current.contains(e.target)){
        setOpen(false);
        console.log(menuRef.current);
      }   
    };

    document.addEventListener("mousedown", handler);
    

    return() =>{
      document.removeEventListener("mousedown", handler);
    }

  });

  return (
    <div className="App">
      <div className='menu-container' ref={menuRef}>
        <div className='menu-trigger' onClick={()=>{setOpen(!open)}}>
          <img src={user.profileImage != null ? `${process.env.REACT_APP_BACKEND_APP_API}/images/${user.profileImage}` : userImg}></img>
        </div>

        <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} >
          <h3>{user.firstname}<br/><span>{user.lastname}</span></h3>
          <ul>
            <ProfileItem img = {userImg} text = {"My Profile"} url={"profile"}/>
            <ProfileItem img = {order} text = {"Address"} url={"address"}/>
            <ProfileItem img = {order} text = {"My orders"} url={"orders"}/>
            <ProfileItem img = {logout} text = {"Logout"} url={"logout"}/>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Profile;