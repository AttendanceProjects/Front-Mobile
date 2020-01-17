import ApolloClient from 'apollo-boost';

//production
export default new ApolloClient({
  uri: 'http://35.197.149.146:4000',
});

// development
// export default new ApolloClient({
//   uri: 'http://localhost:4000'
// })