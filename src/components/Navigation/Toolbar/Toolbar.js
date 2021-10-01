import React from 'react';
import classes from './Toolbar.module.css';
import NavigationItems from '../NavigationItems/NavigationItems';
import Aux from '../../../hoc/Aux/Aux';
import Modal from '../../UI/Modal/Modal';
import Login from '../../Login/Login';

class toolbar extends React.Component{
    state = {
        loginModal: false
    }
    loginCancelHandler(){
        this.setState({
            loginModal:false
        })
    }
    loginHandler(){
        this.setState({
            loginModal:true
        })
    }
    render(){
        return (<Aux>
            <header className={classes.Toolbar}>
                <nav className={classes.DesktopOnly}>
                    <NavigationItems isAuthenticated={this.props.isAuth} login={this.state.loginModal} loginHandler={this.loginHandler.bind(this)}></NavigationItems>
                </nav>
            </header>
            <Modal show={this.state.loginModal} modalClosed={this.loginCancelHandler.bind(this)}>
                <Login modalClosed={this.loginCancelHandler.bind(this)}/> {/* Modal with facebook and google button and form validation */}
            </Modal>
        </Aux>
        )
    
    }
}
    
export default toolbar;