import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import Button from '../../../components/UI/Button/Button';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../../..//store/action';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {apiAxios, serverAxios} from '../../../axios-base';

const url = `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_MOVIE_API_KEY}`
const localUrl = 'http://localhost:1337/favorite-movies'
class SingleMovie extends React.Component {
  state = {
    movie: {
      poster: '',
      title: '',
      plot: '',
      year: '',
      id: ''
    },
    liked: false,
    error: null,
    isLoading: false,
    favId: '',
    favorites: true // only to check from which page individual movie page is called
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    const { match: { params }, location: { search } } = this.props;
    this.setState({ favorites: search.split('?favorites=')[1] })
    apiAxios.get(`?apikey=${process.env.REACT_APP_MOVIE_API_KEY}&i=${params.id}`)
      .then(response => {
        this.setState({
          movie: {
            poster: response.data.Poster,
            title: response.data.Title,
            plot: response.data.Plot,
            year: response.data.Year,
            id: response.data.imdbID
          },
          isLoading: false
        })
        if (this.props.token) {
          // to check if the movie is already liked by the authenticated user
          return serverAxios.get(`favorite-movies?movieId=${this.state.movie.id}&email=${this.props.userId}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization:
              `Bearer ${this.props.token}`
            }
          })
        }
        return null;
        //get if its already a favorite movie of the user or not
      })
      .then(favMovie => {
        if (favMovie !== null && favMovie.data.length > 0) {
          this.setState({favId:favMovie.data[0].id})
          this.setState({ liked: true })
        }
        return null;
      })
      .catch(err => {
        if (err.response.status == 404) {
          return null;
        }
        else {
          this.setState({ error: err })
        }

      })
  }
  addToFavorites() {
    if (this.props.token) {
      serverAxios.post('favorite-movie',
        {
          movieId: this.state.movie.id,
          image: this.state.movie.poster,
          title: this.state.movie.title,
          email: this.props.userId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              `Bearer ${this.props.token}`,
          }
        })
        .then(response => {
          this.setState({
            liked: true
          })
          toast.success("Movie Added To your favorite list!");
          this.props.addFavMovie(this.state.movie)
        })
        .catch(err => {
          this.setState({ error: err })
        })
    }
    else {
      this.props.setAuthRedirectPath(`movies/${this.state.movie.id}`);
      this.props.history.push('/auth');
    }

  }
  removeFromFavroites() {
    if (this.props.token) {
      serverAxios.delete(`favorite-movies/${this.state.favId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            `Bearer ${this.props.token}`,
        }
      })
        .then(response => {
          this.setState({
            liked: false
          })
          this.props.removeFavMovie(null,this.state.movie.id);
          toast.success("Movie Removed from your favorite list!");
        })
        .catch(err => {
          if (err.response.status == 404) {
            return null;
          }
          else {
            this.setState({ error: err })
          }
        })
    }
    else {
      this.props.setAuthRedirectPath(`movies/${this.state.movie.id}`);
      this.props.history.push('/auth');
    }
  }

  render() {
    if (this.state.isLoading) {
      return <div className='loading'></div>
    }
    if (this.state.error) {
      return (
        <div className='page-error'>
          <h1>{this.state.error}</h1>
          {this.state.favorites ?
            <Link to='/' className='btn'>
              Back to movies
            </Link> :
            <Link to='/favorites' className='btn'>
              Back to favorites
            </Link>}

        </div>
      )
    }
    const { poster, title, plot, year } = this.state.movie;
    const liked = this.state.liked;
    return (
      <section className='single-movie'>
        <img src={poster} alt={title} />
        <div className='single-movie-info'>
          <h2>{title}</h2>
          <p>{plot}</p>
          <h4>{year}</h4>
          {this.state.favorites ?
            <Link to='/' className='btn'>
              Back to movies
            </Link> :
            <Link to='/favorites' className='btn'>
              Back to favorites
            </Link>}
          {!this.state.liked ? <Button disabled={false} clicked={this.addToFavorites.bind(this)}>Add to Favorites</Button> :
            <Button disabled={false} btnType='Danger' clicked={this.removeFromFavroites.bind(this)}>Remove From Favorites</Button>}
        </div>
        <ToastContainer autoClose={2000} />
      </section>)
  }
}
const mapStateToProps = state => {
  return {
    token: state.token,
    userId: state.userId,
    authRedirectPath: state.authRedirectPath
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setAuthRedirectPath: (auth) => dispatch(actions.setAuthRedirectPath(auth)),
    removeFavMovie: (movieIndex,movieId) => dispatch(actions.removeFavMovie(movieIndex,movieId)),
    addFavMovie: (movie) => dispatch(actions.addFavMovie(movie))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SingleMovie));
