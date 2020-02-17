import ApolloClient from 'apollo-boost';

//production
export default new ApolloClient({
  uri: 'http://34.87.33.79:4000',
});

// development
// export default new ApolloClient({
//   uri: 'http://localhost:4000'
// })