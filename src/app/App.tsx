import { FunctionComponent } from 'react';

import MoviesList from '../features/movies/MoviesList';

const App: FunctionComponent = () => {
  return (
    <div>
      <header>TMDB top 500 movies</header>
      <MoviesList />
    </div>
  );
};

export default App;
