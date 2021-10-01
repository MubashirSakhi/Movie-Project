import React from 'react'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'
import Login from './containers/Auth/Login';
import Logout from './containers/Auth/Logout/Logout';
import Home from './Home'
import FavMovies from './containers/Favorites/Favorites';
import Movie from './containers/Movies/Movie/Movie'
import Layout from './hoc/Layout/Layout'
import { connect } from 'react-redux';



class App extends React.Component {
  render() {
    let routes = (
      <Switch>
        <Route path="/auth" component={Login} />
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/movies/:id' component={Movie} />
       
        <Redirect to="/" />

      </Switch>
    )
    if (this.props.isAuthenticated) {

      routes = (
        <Switch>
          <Route path='/' exact>
            <Home />
          </Route>
          <Route path='/movies/:id' component={Movie} />
          <Route path="/favorites" component={FavMovies}></Route>
          <Route path="/logout" component={Logout} />
          <Redirect to={this.props.authRedirectPath} />
        </Switch>
      )

    }
    return (
      <Layout>
        {routes}
      </Layout>
    )
  }
}
const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null,
    authRedirectPath: state.authRedirectPath
  };
};


export default withRouter( connect( mapStateToProps, null )( App ) );