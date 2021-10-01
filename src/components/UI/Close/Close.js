import React from 'react';
import classes from './Close.module.css';

const Close = (props) => {
    return <button className={classes.close} onClick={(movieIndex,movieId) => props.clicked(props.movieIndex,props.movieId)}></button>
}
export default Close;