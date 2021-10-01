import React from 'react';
import classes from './NavigationItems.module.css';

import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props)=> (
    
    <ul className={classes.NavigationItems}>
        
        
        <NavigationItem link="/">Home</NavigationItem>
        {props.isAuthenticated ? <NavigationItem link="/favorites">Favorites</NavigationItem>:null}
        {!props.isAuthenticated ? 
        <NavigationItem  link="/auth" active>Login</NavigationItem> : 
        <NavigationItem link="/logout">Logout</NavigationItem>
        }
    </ul>
)
export default navigationItems;