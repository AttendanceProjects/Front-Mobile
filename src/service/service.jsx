import axios from 'axios';

export const server = (code) => {
  if( code === '0001' ) return axios.create({ baseURL: 'http://34.87.33.79:3001' })
  else return { msg: 'Invalid Code Company' }
}

export const serverTime = ( code ) => {
  if( code === '0001' ) return axios.create({ baseURL: 'http://34.87.33.79:3001' })
  // if( code === '0001' ) return axios.create({ baseURL: 'http://localhost:3001' })

  else return { msg: 'Invalid Code Company' }
}