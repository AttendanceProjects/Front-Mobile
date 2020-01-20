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

// Attendance 

export const USER_ATT = gql`
  query userAtt ( $code: String, $token: String ){
    userAtt ( code: $code, token: $token ) {
      _id
      UserId {
        _id
        username
        email
        role
      }
      start
      start_image
      end
      end_image
      date
    }
  }
`