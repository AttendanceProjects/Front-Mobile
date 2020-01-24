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

// History 

export const GET_HISTORY = gql`
  query getHistory ( $code: String, $token: String ) {
    getHistory ( code: $code, token: $token ) {
      AttendanceId {
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
      createdAt
      UserId
    }
  }
`