import nodemailer from 'nodemailer'
import generator from 'generate-password'
import passwordHash from 'password-hash'
import getMongoConnection from './mongo-connection.js'
import { IUser } from '../models'
import mongoose from 'mongoose'

const SendTempPassword = async (user: IUser ) => {
  
  const password = generator.generate({
    length: 8,
    numbers: true
  })
  const hashedTempPassword = passwordHash.generate('password')
  const text = `Hello your Arena user name is: ${user.userName}\n\n your temporary password is: ${password}`
  const db: mongoose.Connection = await getMongoConnection()
  await db.collection('user')
    .update(
      { name: user.userName },
      { password: hashedTempPassword, user: user.userName, email: user.email },
      { upsert: false }
    )
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'thechampionsarena@gmail.com',
      pass: 'Han4567!'
    }
  })
  const mailOptions = {
    from: 'TheChampionsArena@gmail.com',
    to: user.email,
    subject: 'The Arena Temporary Password',
    text,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Sending password email error: ', error)
    } else {
      console.log(`Message sent: ${info.response}`)
    }
  })
}

export default SendTempPassword