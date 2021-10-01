import React from 'react';
import classes from './NavigationItem.module.css';
import {Link} from 'react-router-dom';
const navigationItem = (props) => {
    
    if (props.loginBtn) {
        return (<li className={classes.NavigationItem}>
            <a
                onClick={props.loginFunc}
                className={props.active ? classes.active : null}>{props.children}</a>
        </li>)
    }
    else {
        return (
            <li className={classes.NavigationItem}>
                <Link
                    to={props.link}
                    className={props.active ? classes.active : null}>{props.children}</Link>
            </li>)
    }

}
export default navigationItem;