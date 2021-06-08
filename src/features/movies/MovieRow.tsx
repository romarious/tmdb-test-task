import { FunctionComponent } from 'react';
import { Movie } from './Movie';

type MovieRowProps = {
    data: Movie
}

const MovieRow: FunctionComponent<MovieRowProps> = ({ data }) => {
  return (
    <div>
        <img src={data.image} alt={data.title} />
        <span>{data.title}</span>
        <span>{data.rating}</span>
        <span>{data.year}</span>
    </div>
  );
};

export default MovieRow;
