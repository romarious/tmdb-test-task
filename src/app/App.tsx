import { FunctionComponent } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import MoviesList from '../features/movies/MoviesList';

const App: FunctionComponent = () => {
  return (
    <Container>
      <Typography variant="h3" component="h1" align="center">
        TMDB top 500 movies
      </Typography>
      <MoviesList />
    </Container>
  );
};

export default App;
