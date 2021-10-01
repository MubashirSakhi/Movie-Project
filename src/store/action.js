import * as actionTypes from './constants';
import {apiAxios,serverAxios} from '../axios-base';
export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}
export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId
    };
};
export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            identifier: email,
            password: password
        }
        serverAxios.post('auth/local', authData)
            .then(response => {
                localStorage.setItem('token', response.data.jwt);
                localStorage.setItem('userId', response.data.user.userId);
                dispatch(authSuccess(response.data.jwt, response.data.user.id));
            })
            .catch(err => {
                dispatch(authFail(err));
            })
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};
export const getMoviesStart = () => {
    return {
        type: actionTypes.GET_MOVIES_START,
    }
}
export const getMovies = (query, page) => {
    return dispatch => {
        dispatch(getMoviesStart());
        let url = `?apikey=${process.env.REACT_APP_MOVIE_API_KEY}&s=${query}&page=${page}`;
        apiAxios.get(url)
            .then(response => {
                if (response.data.Response === "True") {
                    dispatch(getMoviesSuceess(response.data.Search, response.data.totalResults, page));
                }
                else {
                    dispatch(getMoviesFailure(response.data.Error))
                }

            })
            .catch(err => {
                dispatch(getMoviesFailure(err))
            })
    }
}
export const getMoviesSuceess = (movies, totalCount, page) => {
    return {
        type: actionTypes.GET_MOVIES_SUCCESS,
        movies,
        totalCount,
        page
    }
}
export const getMoviesFailure = (error) => {
    return {
        type: actionTypes.GET_MOVIES_FAILURE,
        error: error
    }

}
export const getFavMovies = (token, userId, page) => {
    let movieCount = 0;
    const start = (page - 1) * 10;
    let url = `http://localhost:1337/favorite-movies`;
    return dispatch => {
        dispatch(getMoviesStart);
        serverAxios.get(`favorite-movies/count?email=${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    `Bearer ${token}`,
            }
        })
            .then(response => {
                movieCount = response.data;
                return serverAxios.get(`favorite-movies?email=${userId}&_limit=10&_start=${start}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:
                            `Bearer ${token}`,
                    }
                })
            })
            .then(response => {
                dispatch(getFavMoviesSuccess(response.data, movieCount,page))
            })
            .catch(err => {
                console.log(err)
                dispatch(getMoviesFailure(err))
            })
    }
}
export const getFavMoviesSuccess = (movies, totalCount, page) => {
    return {
        type: actionTypes.GET_FAVMOVIES_SUCCESS,
        movies,
        totalCount,
        page
    }
}
export const setQuery = (query) => {
    return {
        type: actionTypes.SET_QUERY,
        query: query
    }
}
export const removeFavMovie = (movieIndex,movieId) => {
    return {
        type:actionTypes.REMOVE_FAVMOVIE,
        movieIndex:movieIndex,
        movieId:movieId
    }
}
export const addFavMovie = (movie) => {
    
    return {
        type: actionTypes.ADD_FAVMOVIE,
        movie:movie
    }
}