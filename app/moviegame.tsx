"use client"
import { useEffect } from 'react';
import axios from 'axios';
import keys from './config/keys';

const options = {
  method: 'GET',
  url: 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=25',  
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
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div></div>
  )
}

