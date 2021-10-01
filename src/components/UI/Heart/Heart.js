import React, { useState } from 'react';
import classes from './Heart.module.css';



const Heart = (props)=> {
  const [like, setLike] = useState(false);
  const [heartClasses, setHeartClasses] = useState([classes.heart]);

 const toggleLike = () => {
    if (!like) {
      setHeartClasses([...heartClasses, classes.heartAnimation]);
      props.addFavoriteMovie(props.title,props.id,props.poster);
    }
    else {
      setHeartClasses([classes.heart]);
      //props.removefunction
      
    }
    setLike(!like);
  }
  return (<div className={heartClasses.join(" ")} onClick={toggleLike}></div>);
}

export default Heart;

