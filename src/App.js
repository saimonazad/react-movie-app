import React, { useReducer, useEffect } from "react";
import './App.css';
import Header from './components/HeaderComponent/Header';
import Search from './components/SearchCompoent/Search';
import Movie from './components/MovieComponent/Movie';

var API_KEY = process.env.REACT_APP_API_KEY;

const MOVIE_API_URL = `https://www.omdbapi.com/?s=batman&apikey=${API_KEY}`;
const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
};

const reduer = (state, action) => {
  switch (action.type) {
    case 'SEARCH_MOVIES_REQUEST':
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case 'SEARCH_MOVIES_SUCCESS':
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case 'SEARCH_MOVIES_FAILURE':
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      }
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reduer, initialState);

  useEffect(() => {
    fetch(MOVIE_API_URL)
      .then(response => response.json())
      .then(jsonResponse => {
        dispatch({
          type: 'SEARCH_MOVIES_SUCCESS',
          payload: jsonResponse.Search
        });
      });
  }, []);

  const search = searchValue => {
    dispatch({ type: 'SEARCH_MOVIES_REQUEST' });
    fetch(`https:///www.omdbapi.com/?s=${searchValue}&apikey=${API_KEY}`)
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.Response === 'True') {
          dispatch({
            type: 'SEARCH_MOVIES_SUCCESS',
            payload: jsonResponse.Search
          });
        } else {
          dispatch({
            type: 'SEARCH_MOVIES_FAILURE',
            error: jsonResponse.Error
          });
        }
      });
  }

  const { movies, errorMessage, loading } = state;

  return (
    <div className="App">
      <Header text="Movie App" />
      <Search search={search} />
      <div className="movies">
        {loading && !errorMessage ? (
          <span>Loading...</span>
        ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
              movies.map((movie, index) => (
                <Movie key={`${index}-${movie.Title}`} movie={movie} />
              ))
            )}
      </div>
    </div>
  );
}

export default App;
