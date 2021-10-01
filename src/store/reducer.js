import * as actionTypes from './constants';
const initialState = {
    token:null,
    userId:null,
    error:null,
    loading:false,
    authRedirectPath:'/',
    movies:[],
    totalCount:0,
    currentPage:1,
    favCurrentPage:1,
    favMovies:[],
    favTotalCount:0,
    query:'batman',
}
const authStart = (state, action) => {
    return {
        ...state,
        error:null,
        loading:true
    }
}
const authSuccess = (state,action) => {
    return {
        ...state,
        token:action.token,
        userId:action.userId,
        error:null,
        loading:false
    }
}
const authFail = (state,action) => {
    return {
        ...state,
        error:action.error,
        loading:false

    }
}
const authLogout = (state, action) => {
    return {
        ...state,
        token:null,
        userId:null,
        favCurrentPage:1
    }
}
const setAuthRedirectPath = (state,action)=>{
    return {
        ...state,
        authRedirectPath:action.path
    }
};
const facebookSuccess = (state,action)=> {
    return {
        ...state,
        token:action.token,
        userId:action.userId,
        error:null,
        loading:false
    }
}
const facebookFailure = (state,action)=> {
    return {
        ...state,
        error:action.error,
        loading:false,
        token:null
    }
}
const getMoviesStart = (state,action) => {
    if(state.query.length > 5){
        return {
            ...state,
            error:null,
            loading:true
        }
    }
    else{
        return {
            ...state,
            error:null,
        }
    }
    
}
const getMoviesSuccess = (state,action) => {
    return {
        ...state,
        error:null,
        loading:false,
        movies:action.movies,
        totalCount:action.totalCount,
        currentPage:action.page
    }
}
const getMoviesFailure = (state,action) => {
    return {
        ...state,
        error:action.error,
        loading:false,
    }
}
const getFavMoviesSuccess = (state,action) => {
    return {
        ...state,
        error:null,
        loading:false,
        favMovies:action.movies,
        favTotalCount:action.totalCount,
        favCurrentPage:action.page
    }
}

const setQuery = (state,action) => {
    return {
        ...state,
        query:action.query
    }
}
const removeFavMovie = (state,action) => {
    //index exists
    let tempMovies = [];
    if(state.favMovies[action.movieIndex] !== undefined){
    tempMovies = [
            ...state.favMovies.slice(0, action.movieIndex),
            ...state.favMovies.slice(action.movieIndex + 1, state.length)
          ];
    }
    else{
       tempMovies = state.favMovies.filter(x => {
            return x.movieId !== action.movieId
        })
    }  
    return {
        ...state,
        favMovies:tempMovies
        
    }
}
const addFavMovie = (state,action) => {
    // fix this line
    
    const tempMovie = [...state.favMovies, action.movie];
    return {
        ...state,
        favMovies:tempMovie
    } 
}
const reducer = (state = initialState, action) => {
    switch ( action.type ) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state,action);
        case actionTypes.FACEBOOK_SUCCESS: return facebookSuccess(state,action);
        case actionTypes.FACEBOOK_FAILURE: return facebookFailure(state,action);
        case actionTypes.GET_MOVIES_START: return getMoviesStart(state,action);
        case actionTypes.GET_MOVIES_SUCCESS: return getMoviesSuccess(state,action);
        case actionTypes.GET_MOVIES_FAILURE: return getMoviesFailure(state,action);
        case actionTypes.GET_FAVMOVIES_SUCCESS: return getFavMoviesSuccess(state,action);
        case actionTypes.SET_QUERY: return setQuery(state,action);
        case actionTypes.REMOVE_FAVMOVIE: return removeFavMovie(state,action);
        case actionTypes.ADD_FAVMOVIE: return addFavMovie(state,action);
        default:
            return state;
    }
}
export default reducer;