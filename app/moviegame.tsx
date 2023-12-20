"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import keys from './config/keys';
import SearchResults from './searchResults';

var randomPage = Math.ceil(Math.random() * 20);
var randomResult = Math.floor(Math.random() * 20);

const options = {
  method: 'GET',
  url: 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=' + randomPage.toString(),  
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + keys.token,
  }
  };

const auth_options = {
    method: 'GET',
    url: 'https://api.themoviedb.org/3/authentication',  
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + keys.token,
    }
  };

export default function MovieGame() {

  const [ currentMovie, setCurrentMovie ] = useState<{title: string}>({title: ''});

  const [ movieInput, setMovieInput ] = useState<string>("");

  const [ searchResponse, setSearchResponse ] = useState<{title: string, release_date: string}[]>([{title: '', release_date: ''}]);

  const [ showResults, setShowResults ] = useState(false);

  const search_options = (movie: string) => {
    return {
      method: 'GET',
      url: 'https://api.themoviedb.org/3/search/movie?query=' + movie + '&include_adult=false&language=en-US&page=1', 
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + keys.token,
      }
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovieInput(e.target.value);    
  }

  useEffect(() => {
    (async () => {
      const response = await axios.request(search_options(movieInput));
      try {
        setSearchResponse(response.data.results);
        setShowResults(true);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [movieInput])

  useEffect(() => {
    (async () => {
      const response = await axios.request(auth_options);
      try {
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    })();

    (async () => {
      const response = await axios.request(options);
      try {
        console.log(response.data);
        setCurrentMovie(response.data.results[randomResult])
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (    
    <div className="flex flex-col w-3/4 lg:w-1/4">
      {currentMovie.title}
      <input className="w-full" type="text" value={movieInput} onChange={handleSearch} onBlur={()=>setShowResults(false)}></input>
      {showResults ? <SearchResults results={searchResponse.slice(0,15)} /> : <div></div>}
    </div>
  )
}

