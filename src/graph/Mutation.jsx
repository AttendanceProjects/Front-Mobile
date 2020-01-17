import { gql } from 'apollo-boost';

// Mutation User

export const SIGN_UP = gql`
  mutation signup ( $code: String, $username: String, $password: String, $email: String, $role: String ) {
    signup ( code: $code, username: $username, password: $password, email: $email, role: $role ) {
      username
      email
      role
    }
  }
`

export const SIGN_IN = gql`
  mutation signin ( $code: String, $request: String, $password: String ) {
    signin ( code: $code, request: $request, password: $password ) {
      user {
        username
        email
        role
      }
      token
    }
  }
`

export const FORGOT = gql`
  mutation forgot ( $code: String, $email: String ) {
    forgot ( code: $code, email: $email ) {
      msg
    }
  }
`

export const CONFIRM = gql`
  mutation confirm ( $code: String, $secretCode: String, $newPass: String ) {
    confirm ( code: $code, secretCode: $secretCode, newPass: $newPass ) {
      username
      email
      role
    }
  }
`

export const CHANGE_PASS = gql`
  mutation changePass ( $code: String, $newPass: String, $token: String ) {
    changePass ( code: $code, newPass: $newPass, token: $token ) {
      username
      password
      role
    }
  }
`