"use client"
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import SearchResults from './searchResults';
import CastMember from './castMember';
import {options, auth_options, movie_options, search_options, detail_options } from './config/axios_options';

var randomResult = Math.floor(Math.random() * 20);

type currentMovieType = {
  title: string,
  id: number,
  summary: string,
  year: string,
  tagline: string,
  genres: string[],
  cast: [] | {name: string, id: number, found: boolean}[],
}

type gameStateType = {
  score: number,
  gameWon: boolean,
  hint_year: boolean,
  hint_description: boolean,
  hint_tagline: boolean,
  hint_genres: boolean
}
 
export default function MovieGame() {

  const [ currentMovie, setCurrentMovie ] = useState<currentMovieType>(
    {
      title: '', 
      id: 0,
      summary: '',
      year: '',
      tagline: '',
      genres: [],
      cast: [],
    }
  );

  const handleHint = (hint: 'year'| 'description' | 'tagline' | 'genres') => {
    switch(hint) {
      case 'year':
        setGameState({...gameState, score: gameState.score - 100, hint_year: true});
        break;
      case 'description':
        setGameState({...gameState, score: gameState.score - 500, hint_description: true});
        break;
      case 'tagline':
        setGameState({...gameState, score: gameState.score - 100, hint_tagline: true});
        break;
      case 'genres':
        setGameState({...gameState, score: gameState.score - 50, hint_genres: true});
    }
  }

  const [ movieInput, setMovieInput ] = useState<string>("");
  const [ searchResponse, setSearchResponse ] = useState<{title: string, release_date: string, id: number}[]>([{title: '', release_date: '', id: 0}]);
  const [ showResults, setShowResults ] = useState(false);
  const [ lastAnswer, setLastAnswer ] = useState(0);
  
  const [ gameState, setGameState ] = useState<gameStateType>({
    score: 1500, 
    gameWon: false,
    hint_year: false,
    hint_description: false,
    hint_tagline: false,
    hint_genres: false,
  });  

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
      var newMovie : currentMovieType = {
        title: '', 
        id: 0,
        summary: '',
        year: '',
        tagline: '',
        genres: [],
        cast: [],
      };
      const response = await axios.request(options);
      try {
        newMovie.id = response.data.results[randomResult].id;
        newMovie.title = response.data.results[randomResult].title;
      } catch (error) {
        console.error(error);
      }
      const movie_response = await axios.request(movie_options(response.data.results[randomResult].id));
      newMovie.cast = movie_response.data.cast.map((actor: {name: string, id: number}) => {
        return {
          name: actor.name,
          found: false,
          id: actor.id,
        }
      });
      const detail_response = await axios.request(detail_options(response.data.results[randomResult].id));
      console.log(detail_response);
      newMovie.summary = detail_response.data.overview;
      newMovie.year = detail_response.data.release_date.slice(0, 4);
      newMovie.tagline = detail_response.data.tagline;
      var genres = [];
      for (var i = 0; i < detail_response.data.genres.length; i++) {
        genres.push(detail_response.data.genres[i].name);
      }
      newMovie.genres = genres;
      setCurrentMovie(newMovie)
    })();
  }, []);

  useEffect(() => {
    console.log(currentMovie);
  }, [currentMovie])

  useEffect(() => {
    setMovieInput("");
    if (lastAnswer !== 0) {
      if (lastAnswer === currentMovie.id) {
        setGameState({...gameState, gameWon: true});
        setCurrentMovie({...currentMovie, cast: currentMovie.cast.map((castMember) => {
          return {...castMember, found: true}
        })});
        inputContainer.current!.hidden = true;        
      } else {
        setGameState({...gameState, score: gameState.score - 100});
        if (gameState.score <= 100) {
          inputContainer.current!.hidden = true;

        }
        (async () => {
        var cast_response = (await axios.request(movie_options(lastAnswer))).data.cast;
        var tempCast = currentMovie.cast;
        var changed = false;
        for (var i = 0; i < cast_response.length; i++) {
          const actorID = cast_response[i].id;
          for (var j = 0; j < currentMovie.cast.length; j++) {
            if (actorID === currentMovie.cast[j].id) {
              tempCast = tempCast.map((castMember) => {
                  return actorID === castMember.id ? {name: castMember.name, id: castMember.id, found: true} : castMember;                  
                }
              );
              changed = true;
            }
          }
        }
        if (changed) {
          setCurrentMovie({...currentMovie, cast: tempCast});
        }
      })();
    }
    }
  }, [lastAnswer]);

  const inputContainer = useRef<HTMLInputElement>(null);

  return (    
    <div>
    <div className="w-full grid md:grid-cols-2 grid-cols-1">
      <div className="grid grid-rows-12">      
        <div className="row-span-1">
          {gameState.gameWon ? <h1>You Won: Final Score - {gameState.score}</h1> : <h1>Current Score: {gameState.score}</h1>}
          {gameState.score <= 0 ? <h1>You lost. The correct title was {currentMovie.title}. Try again!</h1> : <h1></h1>}
          <input ref={inputContainer} className="text-black w-full" type="text" value={movieInput} onChange={handleSearch} onBlur={()=>setShowResults(false)} onFocus={()=>setShowResults(true)}></input>
        </div>    
        <div className="gameContainer">
          <div className="grid grid-rows-2">
          <div className="row-span-2 row-start-1 col-start-1">
                {currentMovie.cast.map((castMember: {name: string, id: number, found: boolean}) => {
                  return <CastMember key={castMember.id} name={castMember.name} found={castMember.found}></CastMember>
                }
                )}
            </div>
            <div className="row-span-2 row-start-1 col-start-1 searchResults">
              {showResults ? <SearchResults  setLastAnswer={setLastAnswer} results={searchResponse.slice(0,15)} /> : <div></div>} 
            </div>
            
          </div>
        </div>      
      </div>
    <div className="p-5">
      <h3>Welcome to the Movie Guessing Game</h3>

      <h4>Guess a movie; actors from that movie who are also in the current game&apos;s movie will appear in green.</h4>

      <h4>Stumped? Try the hints below:</h4>
      <div className="mt-2">
        {gameState.hint_genres ? 
          <div>
            Genres: {currentMovie.genres.map((genre) => {
              return <span className="border pl-1 pr-1 mr-2" key={genre}>{genre}</span>
            })}
          </div> :
          <button className="bg-white text-black" onClick={() => handleHint('genres')}>Genres -50 Points</button>
        }
      </div>
      <div className="mt-2">
        {gameState.hint_year ? 
          <div>Release Date: {currentMovie.year}</div> : 
          <button className="bg-white text-black" onClick={() => handleHint('year')}>Release Year -100 Points</button>
        }
      </div>
      <div className="mt-2">
        {gameState.hint_tagline ?
          <div>Tagline: {currentMovie.tagline}</div> :
          <button className="bg-white text-black" onClick={() => handleHint('tagline')}>Tagline -100 Points</button>
        }
      </div>
      <div className="mt-2">
        {gameState.hint_description ?
          <div>Description: {currentMovie.summary}</div> :
          <button className="bg-white text-black" onClick={() => handleHint('description')}>Description -500 Points</button>          
        }
      </div>      
    </div>    
    </div>    
</div>
  )
}

