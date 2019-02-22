const mustache = require('mustache')
const mail = require('@sendgrid/mail')
const config = require('./config.json')

const getSubject = data => {
  return mustache.render(config.SUBJECT, data)
}

const getText = data => {
  return mustache.render(config.TEXT, data)
}

const getHtml = data => {
  return mustache.render(config.HTML, data)
}

exports.sendMail = (req, res) => {
  // Only serve POST requests
  // GET requests for email are vulnerable to manipulation for spam
  if (req.method !== 'POST') {
    const error = new Error('Only POST requests are accepted')
    error.code = 405
    throw error
  }

  mail.setApiKey(config.API_KEY)

  const to = req.body.to
  const subject = getSubject(req.body)
  const text = getText(req.body)
  const html = getHtml(req.body)

  const message = {
    to: to,
    from: config.FROM,
    subject: subject,
    text: text,
    html: html
  }

  // Send the mail via SendGrid
  mail
    .send(message)
    .then(() => {
      // Send success response
      return res.status(200).send('OK')
    })
    .catch(err => {
      // Send error response
      return res.status(400).send(err)
    })
}
