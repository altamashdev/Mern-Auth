//i use BREVO smtp for this app
import nodemailer from 'nodemailer'

// creating a default function for call anywhere we want to send mail
const transporter = nodemailer.createTransport({

    // this all info from brevo the smtp provider 
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {

        // its from env folder but also from brevo in env
        user : process.env.SMTP_USER,
        pass : process.env.SMTP_PASS
    }
});

export default transporter;