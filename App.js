import React from 'react';
import Navigator from './navigation';
import { Client } from './graph';
import { ApolloProvider } from '@apollo/react-hooks';

export default () => (
  <ApolloProvider client={ Client }>
    <Navigator theme='dark'/>
  </ApolloProvider>
)
