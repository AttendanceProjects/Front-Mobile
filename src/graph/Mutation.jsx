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
  mutation changePass ( $code: String, $newPass: String, $token: String, $oldPass: String ) {
    changePass ( code: $code, newPass: $newPass, token: $token, oldPass: $oldPass ) {
      msg
    }
  }
`

export const UPDATE_PROFILE_IMAGE = gql`
  mutation updateProfile ($code: String, $token: String, $image: String) {
    updateProfile( code: $code, token: $token, image: $image ) {
      _id
      profile_image
    }
  }
`

export const FILTER_EMPLOYEE = gql `
  mutation filterEmployee ( $code: String, $token: String, $search: String ) {
    filterEmployee ( code: $code, token: $token, search: $search ) {
      _id
      username
      email
      role
      phone
      profile_image
      gender
    }
  }
`

// Attendance

export const CREATE_ATT = gql`
  mutation createAtt ( $code: String, $token: String, $start_image: String, $start_reason: String ) {
    createAtt ( code: $code, token: $token, start_image: $start_image, start_reason: $start_reason ) {
      _id
    }
  }
`

export const CREATE_ATT_OFFILE = gql`
  mutation createOffline ( $code: String, $token: String, $start_image: String, $start_reason: String, $clock: String ) {
    createOffline( code: $code, token: $token, start_image: $start_image, start_reason: $start_reason, clock: $clock ) {
      _id
    }
  }
`

export const UPDATE_ATT_OFFLINE = gql `
  mutation updateOffline ( $code: String, $token: String, $end_image: String, $clock: String, $id: String ) {
    updateOffline( code: $code, token: $token, end_image: $end_image, clock: $clock, id: $id ) {
      _id
    }
  }
`

export const CHECK_OUT_ATT = gql`
  mutation updateAtt ( $code: String, $token: String, $end_image: String, $id: String, $end: String ) {
    updateAtt ( code: $code, token: $token, end_image: $end_image, id: $id , end: $end) {
      _id
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

export const FAIL_PROCESS = gql`
  mutation failProcess ( $code: String, $token: String, $id: String ) {
    failProcess (code: $code, token: $token, id: $id) {
      msg
    }
  }
`


// Correction 

export const CREATE_CORRECTION = gql`
  mutation createCorrection ( $code: String, $token: String, $image: String, $start_time: String, $end_time: String, $reason: String, $id: String ) {
    createCorrection( code: $code, token: $token, id: $id, start_time: $start_time, end_time: $end_time, reason: $reason, image: $image ) {
      msg
    }
  }
`

export const SEE_REQ_CORRECTION = gql`
  mutation reqIn ( $code: String, $token: String, $pin_security: Int ) {
    reqIn ( code: $code, token: $token, pin_security: $pin_security ) {
      _id
      AttId
      UserId  {
        _id
        username
        profile_image
        email
        phone
      },
      reason
      image
      start
      start_time
      end
      end_time
      status
      createdAt
      updatedAt
    }
  }
`

export const CHECK_PIN = gql `
  mutation checkPin ( $code: String, $token: String, $pin_security: Int ) {
    checkPin ( code: $code, token: $token, pin_security: $pin_security ) {
      status
      message
    }
  }
`

export const RES_CORRECTION = gql`
  mutation responseCorrection( $code: String, $token: String, $pin_security: Int, $id: String, $res: String ) {
    responseCorrection( code: $code, token: $token, pin_security: $pin_security, id: $id, res: $res ) 
  }
`