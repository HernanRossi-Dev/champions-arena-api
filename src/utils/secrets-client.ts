// https://aws.amazon.com/developers/getting-started/nodejs/

import AWS from 'aws-sdk'
import { logger } from '.'
const REGION = "us-east-2"
const SECRETNAME = "ChampionsArena"
let secret: string, decodedBinarySecret: string

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
const SecretClient = () => {
  if (secret || decodedBinarySecret) return secret || decodedBinarySecret
  const client = new AWS.SecretsManager({
    region: REGION
  })
  client.getSecretValue({ SecretId: SECRETNAME }, (err, data) => {
    if (err) {
      logger.error({
        message: "AWS secret manager exception.",
        error: err.message,
        code: err.code
      })
    }
    else {
      // Decrypts secret using the associated KMS CMK.
      // Depending on whether the secret is a string or binary, one of these fields will be populated.
      if ('SecretString' in data) {
        secret = data.SecretString || ''
      } else {
        const encodingString = <string>data.SecretBinary
        let buff = new Buffer(encodingString, 'base64')
        decodedBinarySecret = buff.toString('ascii')
      }
    }
  })
}

export {
  SecretClient,
}