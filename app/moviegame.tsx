"use client"
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import keys from './config/keys';
import SearchResults from './searchResults';
import CastMember from './castMember';

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

  const [ currentMovie, setCurrentMovie ] = useState<{title: string, id: number}>({title: '', id: 0});

  const [ movieInput, setMovieInput ] = useState<string>("");

  const [ searchResponse, setSearchResponse ] = useState<{title: string, release_date: string, id: number}[]>([{title: '', release_date: '', id: 0}]);

  const [ showResults, setShowResults ] = useState(false);

  const [ lastAnswer, setLastAnswer ] = useState(0);

  const [ cast, setCast ] = useState<[] | {name: string, id: number, found: boolean}[]>([]);

  var castList : React.JSX.Element[] = [];

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

  const movie_options = (id: number) => {
    return {
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/' + id.toString() + '/credits?language=en-US',
      headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + keys.token,
      }
    }
  }


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
        console.log(response.data.results[randomResult]);
        setCurrentMovie(response.data.results[randomResult])
      } catch (error) {
        console.error(error);
      }
      const movie_response = await axios.request(movie_options(response.data.results[randomResult].id));
      setCast(movie_response.data.cast.map((actor: {name: string, id: number}) => {
        return {
          name: actor.name,
          found: false,
          id: actor.id,
        }
      }));
    })();
  }, []);

  useEffect(() => {

  }, [cast])

  useEffect(() => {
    if (lastAnswer !== 0) {
      (async () => {
        var cast_response = (await axios.request(movie_options(lastAnswer))).data.cast;
        for (var i = 0; i < cast_response.length; i++) {
          const actorID = cast_response[i].id;
          for (var j = 0; j < cast.length; j++) {
            if (actorID === cast[j].id) {
              setCast(
                cast.map((castMember) => {
                  return actorID === castMember.id ? {name: castMember.name, id: castMember.id, found: true} : castMember;
                })
              );
            }
          }
        }
      })();
    }
  }, [lastAnswer])

  return (    
    <div className="flex flex-col w-3/4 lg:w-1/4">
      {currentMovie.title}
      <input className="w-full" type="text" value={movieInput} onChange={handleSearch} onBlur={()=>setShowResults(false)} onFocus={()=>setShowResults(true)}></input>
      {showResults ? <SearchResults  setLastAnswer={setLastAnswer} results={searchResponse.slice(0,15)} /> : <div></div>}
      {cast.map((castMember: {name: string, id: number, found: boolean}) => {
      return <CastMember key={castMember.id} name={castMember.name} found={castMember.found}></CastMember>
    })}
    </div>
  )
}

