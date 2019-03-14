import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import client from './apolloClient';
import App from './App';

const Root = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

render(<Root />, document.getElementById('root'));
