import React from 'react'
import { Link } from 'react-router-dom'
import Aux from '../../hoc/Aux/Aux';
import Pagination from '../../components/Pagination/pagination';
import { connect } from 'react-redux';
import * as actions from '../../store/action';
import Close from '../../components/UI/Close/Close';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
const url =
    'https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png'

const addUrl = 'http://localhost:1337/favorite-movies'

class FavMovies extends React.Component {
    state = {
        query: '',
        currentPage: ''

    }
    onPageChange(page) {
        this.props.getFavMovies(this.props.token, this.props.userId, page)
    }
    removeFromFavoriteMovies(movieIndex, movieId) {
        if (this.props.token) {
            axios.delete(addUrl + "/" + movieId, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:
                        `Bearer ${this.props.token}`,
                }
            })
                .then(response => {
                    this.props.removeFavMovie(movieIndex,null)
                    toast.success("Movie Removed from your favorite list!");
                })
                .catch(err => {
                    console.log(err);
                })
        }
        else {
            this.props.setAuthRedirectPath(`movies/${this.state.movie.id}`);
            this.props.history.push('/auth');
        }
    }
    componentDidMount() {
        if (this.props.movies.length < 0) {
            console.log('do nothing');
        }
        else {
            this.props.getFavMovies(this.props.token, this.props.userId, this.props.currentPage)
        }

    }
    render() {
        if (this.props.loading) {
            return <div className='loading'></div>
        }
        return (
            <Aux>
                <section className='movies'>

                    {this.props.movies.map((movie, idx) => {
                        const { id: id, movieId: movieId, image: image, title: title } = movie

                        return (
                            <div to={`/movies/${movieId}`} key={idx} className='movie'>
                                <article>
                                    <img src={image === 'N/A' ? url : image} alt={title} />

                                    <Link to={`/movies/${movieId}?favorites=true`}>
                                        <div className='movie-info'>
                                            <h4 className='title'>{title}</h4>

                                        </div>
                                    </Link>

                                    <div>
                                        <Close movieIndex={idx} movieId={id} clicked={this.removeFromFavoriteMovies.bind(this)}></Close>
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
        token: state.token,
        userId: state.userId,
        movies: state.favMovies,
        totalCount: state.favTotalCount,
        currentPage: state.favCurrentPage,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
        getFavMovies: (token, userId, page) => dispatch(actions.getFavMovies(token, userId, page)),
        removeFavMovie:(movieIndex,movieId) => dispatch(actions.removeFavMovie(movieIndex,movieId))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FavMovies);

