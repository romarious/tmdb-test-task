import { FunctionComponent } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectMovies } from './moviesSlice';
import MovieRow from './MovieRow';

const MoviesList: FunctionComponent = () => {
    const movies = useAppSelector(selectMovies);

  return (
    <div>{
        movies.map(movie => <MovieRow key={movie.id} data={movie} />)
    }</div>
  );
};

export default MoviesList;
