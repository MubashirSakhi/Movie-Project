import React from 'react';
import classes from './Login.module.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button'
import Modal from '../../components/UI/Modal/Modal'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../../store/action'
import { withRouter } from "react-router";
const LOGINURL = 'http://localhost:1337/auth/local';


class Login extends React.Component {
    state = {
        login: true,
        formIsValid: false,
        isLoading: false,
        error: {
            show: false,
            msg: ""
        },
        userToken: null,
        userEmai: null,
        loginForm: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your-email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: "Type your password here"
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    isPassword: true
                },
                valid: false,
                touched: false
            }

        },
        serverError: {
            email: null,
            password: null
        }
    }
    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        if (rules.required) {
            isValid = value.trim() !== " " && isValid;
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }
        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }
        if (rules.isPassword) {
            const pattern = /^[a-zA-Z0-9_]*$/; //writeregex for password check
            isValid = pattern.test(value) && isValid
        }
        return isValid
    }
    toggleModalView() {
        this.setState((prevState) => {
            return { login: !prevState.login }
        })
    }
    inputChangeHandler = (event, inputIdentifier) => {
        const updatedLoginForm = {
            ...this.state.loginForm
        };
        const updatedFormElement = {
            ...updatedLoginForm[inputIdentifier]
        }
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedLoginForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;
        for (let inputIdentifier in updatedLoginForm) {
            formIsValid = updatedLoginForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({ loginForm: updatedLoginForm, formIsValid: formIsValid });
    }
    LoginHandler(event) {
        event.preventDefault();
        this.props.onAuth( this.state.loginForm.email.value, this.state.loginForm.password.value, this.state.login );
    }
    SignupHandler() {

    }
    redirectToHome(){
        // this.props.history.push('/')
    }
    render() {
        const formElementsArray = [];
        for (let key in this.state.loginForm) {
            formElementsArray.push({
                id: key,
                config: this.state.loginForm[key]
            })
        }
        let form = (
            <form onSubmit={this.LoginHandler.bind(this)}>
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        change={(event) => this.inputChangeHandler(event, formElement.id)}
                    />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>Submit</Button>
                <div>
                <Button btnType="Facebook">Facebook Login</Button><br/>
                <Button btnType="Google">Google Login</Button>
                </div>
                
            </form>
        )
        if (this.props.isLoading) {
            return <div className='loading'></div>
        }
        let errorMessage = null;

        if (this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }
        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath}/>
        }
        return (
            <Modal show="true" modalClosed={this.redirectToHome}>
            <div className={classes.Login}>
                {authRedirect}
                {errorMessage}
                <h4>Login</h4>
                {form}
            </div>
            </Modal>
        );
        
    }
}
const mapStateToProps = state => {
    return {
        loading:state.loading,
        error:state.error,
        isAuthenticated:state.token !== null,
        authRedirectPath: state.authRedirectPath
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email,password,isSignup) => dispatch(actions.auth(email,password,isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}
export default connect( mapStateToProps, mapDispatchToProps )( Login );