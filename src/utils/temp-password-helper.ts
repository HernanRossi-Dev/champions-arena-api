import nodemailer from 'nodemailer'
import generator from 'generate-password'
import getMongoConnection from './mongo-connection'
import { IUser } from '../models'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import logger from './logger'

const SendTempPassword = async (user: IUser) => {
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

  const adminEmail = process.env.APP_EMAIL
  const adminPass = process.env.APP_EMAIL_PASS
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: adminEmail,
      pass: adminPass
    }
  })
  const mailOptions = {
    from: adminEmail,
    to: user.email,
    subject: 'The Arena Temporary Password',
    text,
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      logger.error({ message: `Failed sending temp password: ${err.message}`, name: err.name })
    } else {
      logger.debug({ message: `Succeeded sending temp password: ${info.response}` })
    }
  })
}

export default SendTempPassword