import axios from 'axios';

export const server = (code) => {
  if( code === '0001' ) return axios.create({ baseURL: 'http://35.197.149.146:3001' })
  else return { msg: 'Invalid Code Company' }
}
