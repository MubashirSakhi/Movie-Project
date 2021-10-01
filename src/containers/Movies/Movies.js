import React, { useState } from 'react'
import { withRouter,Link } from 'react-router-dom'
import Heart from '../../components/UI/Heart/Heart';
import Aux from '../../hoc/Aux/Aux';
import Pagination from '../../components/Pagination/pagination';
import SearchForm from '../../components/SearchForm';
import { connect } from 'react-redux';
import * as actions from '../../store/action';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const url =
  'https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png'
const addUrl = 'http://localhost:1337/favorite-movies'

class Movies extends React.Component {
  state = {
    query: '',
    currentPage: ''

  }
  onPageChange(page) {
    this.props.getMovies(this.props.query, page)
  }
  setQuery(query) {
    this.props.setQuery(query);
    this.props.getMovies(query, 1);
  }
  addFavoriteMovie(title, id, poster) {
    if (this.props.token) {
     //return a promise here
      axios.post(addUrl,
        {
          movieId: id,
          image: poster,
          title: title,
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
          toast.success("Movie Added To your favorite list!");
          this.props.addFavMovie(this.state.movie)
         
        })
        .catch(err => {
          console.log(err);
        })
    }
    else {
      this.props.history.push('/auth');
    }
  }
  componentDidMount() {
    if (this.props.movies.length > 0) {
    }
    else {
      this.props.getMovies(this.props.query, this.props.currentPage)
    }

  }
  render() {
    if (this.props.loading) {
      return <div className='loading'></div>
    }
    return (
      <Aux>
        <SearchForm setQuery={query => this.setQuery(query)} query={this.props.query} />
        <section className='movies'>

          {this.props.movies.map((movie) => {
            const { imdbID: id, Poster: poster, Title: title, Year: year } = movie

            return (
              <div to={`/movies/${id}`} key={id} className='movie'>
                <article>
                  <img src={poster === 'N/A' ? url : poster} alt={title} />

                  <Link to={`/movies/${id}?favorites=false`}>
                    <div className='movie-info'>
                      <h4 className='title'>{title}</h4>
                      <p>{year}</p>
                    </div>
                  </Link>

                  <div>
                    <Heart title={title} poster={poster} id={id} addFavoriteMovie={this.addFavoriteMovie.bind(this)}></Heart>
                  </div>
                </article>
              </div>
            )
          })}
        </section>
        <Pagination className="pagination-bar"
          currentPage={this.props.currentPage}
          totalCount={this.props.totalCount}
          pageSize='10'
          onPageChange={page => this.onPageChange(page)} />
      </Aux>)
  }
}

const mapStateToProps = state => {
  return {
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.token !== null,
    movies: state.movies,
    totalCount: state.totalCount,
    currentPage: state.currentPage,
    query: state.query,
    token:state.token,
    userId:state.userId
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
    setQuery: (query) => dispatch(actions.setQuery(query)),
    getMovies: (query, page) => dispatch(actions.getMovies(query, page)),
    addFavMovie: (movie) => dispatch(actions.addFavMovie(movie))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Movies));

