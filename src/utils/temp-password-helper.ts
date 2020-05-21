import nodemailer from 'nodemailer'
import generator from 'generate-password'
import getMongoConnection from './mongo-connection.js'
import { IUser } from '../models'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const SendTempPassword = async (user: IUser ) => {
  const saltRounds = 10
  const password = generator.generate({
    length: 8,
    numbers: true
  })
  const hashPass = await bcrypt.hash(password, saltRounds)

  const text = `Hello your Arena user name is: ${user.userName}\n\n your temporary password is: ${hashPass}`
  const db: mongoose.Connection = await getMongoConnection()
  await db.collection('user')
    .update(
      { name: user.userName },
      { password: hashPass },
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