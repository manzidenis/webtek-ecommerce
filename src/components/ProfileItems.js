/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
function ProfileItem(props){
    return(
      <li className = 'dropdownItem'>
        <img src={props.img}></img>
        <a href={`/${props.url}`}> {props.text} </a>
      </li>
    );
  }

export default ProfileItem;