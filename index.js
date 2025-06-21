const express = require('express')
const twilio = require('twilio')

const app = express()
app.use(express.urlencoded({ extended: false }))

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

app.post('/webhook', (req, res) => {
  const incomingMsg = req.body.Body
  const from = req.body.From

  if (incomingMsg.toLowerCase().includes('سلام')) {
    client.messages
      .create({
        from: 'whatsapp:+14155238886',
        to: from,
        body: 'سلام! چطور می‌توانم کمک کنم؟'
      })
      .then(() => res.status(200).send('پیام ارسال شد'))
      .catch(err => res.status(500).send(err))
  } else {
    res.status(200).send('پیام دریافت شد')
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT)
})
