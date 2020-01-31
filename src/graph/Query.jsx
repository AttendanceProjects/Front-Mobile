import { gql } from 'apollo-boost'


// User Query

export const CHECK_SIGN_IN = gql`
  query checkUserSignin ( $code: String, $token: String ) {
    checkSignin ( code: $code, token: $token ) {
      username
      email
      role
      profile_image
      phone
      identityNumber
      religion
      gender
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
      start_issues
      start_location {
        latitude
        longitude
      }
      end
      end_image
      end_issues
      end_location {
        latitude
        longitude
      }
      end_reason
      date
    }
  }
`

export const GET_DAILY_USER = gql `
  query dailyUser ( $code: String, $token: String ) {
    dailyUser ( code: $code, token: $token ) {
      msg
    }
  }
`

// History Attendance

export const GET_HISTORY = gql`
  query getHistory ( $code: String, $token: String ) {
    getHistory ( code: $code, token: $token ) {
      _id
      UserId {
        username
        profile_image
        role
      }
      start
      start_issues
      end
      end_issues
      end_reason
      date
    }
  }
`

export const GET_ATT_ID = gql`
  query findAttId ( $code: String, $token: String, $id: String ) {
    findAttId ( code: $code, token: $token, id: $id ) {
      _id
      UserId {
        _id
        username
        password
        profile_image
        email
        role
      }
      start
      start_image
      start_issues
      start_location {
        latitude
        longitude
      }
      start_reason
      end
      end_image
      end_issues
      end_location {
        latitude
        longitude
      }
      end_reason
      date
    }
  }
`

export const FILTER_ATT = gql`
  query filter ( $code: String, $token: String, $category: String ) {
    filter ( code: $code, token: $token, category: $category ) {
      _id
      UserId {
        username
        profile_image
        role
      }
      start
      start_issues
      end
      end_issues
      end_reason
      date
    }
  }
`