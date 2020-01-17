import { gql } from 'apollo-boost'


// User Query

export const CHECK_SIGN_IN = gql`
  query checkUserSignin ( $code: String, $token: String ) {
    checkSignin ( code: $code, token: $token ) {
      username
      email
      role
    }
  }
`

export const APPROVAL = gql`
  query seeAllApproval ( $code: String ) {
    approval ( code: $code ) {
      username
      email
      role
    }
  }
`