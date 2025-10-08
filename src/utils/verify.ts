import * as crypto from 'crypto'

export function generateVerificationToken (length = 32):string{
   return crypto.randomBytes(length).toString('hex')
}