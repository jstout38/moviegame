import keys from './keys';

var randomPage = Math.ceil(Math.random() * 25);

export const options = {
  method: 'GET',
  url: 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=' + randomPage.toString() + '&release_date.gte=1970-01-01&sort_by=revenue.desc',  
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + keys.token,
  }
  };

export const auth_options = {
    method: 'GET',
    url: 'https://api.themoviedb.org/3/authentication',  
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + keys.token,
    }
  };

export const search_options = (movie: string) => {
    return {
      method: 'GET',
      url: 'https://api.themoviedb.org/3/search/movie?query=' + movie + '&include_adult=false&language=en-US&page=1', 
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + keys.token,
      }
    }
  };

export const movie_options = (id: number) => {
    return {
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/' + id.toString() + '/credits?language=en-US',
      headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + keys.token,
      }
    }
  }

export const detail_options = (id: number) => {
    return {
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/' + id.toString() + '?language=en-US',
      headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + keys.token,
      }
    }
  }

