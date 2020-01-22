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

// Attendance

export const CREATE_ATT = gql`
  mutation createAtt ( $code: String, $token: String, $start_image: String ) {
    createAtt ( code: $code, token: $token, start_image: $start_image ) {
      _id
      # UserId {
      #   _id
      #   username
      #   email
      #   role
      # }
      # start
      # start_images
    }
  }
`

export const CHECK_OUT_ATT = gql`
  mutation updateAtt ( $code: String, $token: String, $end_image: String ) {
    updateAtt ( code: $code, token: $token, end_image: $end_image ) {
      history {
        _id
        # AttendanceId {
        #   _id
        #   UserId {
        #     _id
        #     username
        #     email
        #     role
        #   }
        #   start
        #   start_image
        #   start_issues
        #   start_location {
        #     latitude
        #     longitude
        #   }
        #   end
        #   end_image
        #   date
        # }
        # createdAt
      }
    }
  }
`


export const UPDATE_LOCATION = gql `
  mutation locUpdate ( $code: String, $token: String, $os: String, $type: String, $id: String, $latitude: String, $longitude: String, $accuracy: String, $reason: String ) {
    locUpdate( code: $code, token: $token, os: $os, type: $type, id: $id, latitude: $latitude, longitude: $longitude, accuracy: $accuracy, reason: $reason ) {
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