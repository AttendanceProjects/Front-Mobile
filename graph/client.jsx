import ApolloClient from 'apollo-boost';

// development
export default new ApolloClient({
  uri: 'http://localhost:4000',
});

// // production
// export default new ApolloClient({
//   uri: ''
// })