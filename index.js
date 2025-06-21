js
const express = require('express');
const twilio = require('twilio');
const { Configuration, OpenAIApi } = require('openai');
const bodyParser = require('body-parser');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

// WhatsApp Webhook
app.post('/webhook', (req, res) => {
  const incomingMsg = req.body.Body;
  const from = req.body.From;

  if (incomingMsg.toLowerCase().includes('سلام')) {
    client.messages
      .create({
        from: 'whatsapp:+14155238886',
        to: from,
        body: 'سلام! چطور می‌توانم کمک کنم؟',
      })
      .then(() => res.status(200).send('پیام ارسال شد'))
      .catch(err => res.status(500).send(err));
  } else {
    res.status(200).send('پیام دریافت شد');
  }
});

// Chat API for HTML page
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // اگر GPT-4 داری، اینجا gpt-4 کن
      messages: [{ role: 'user', content: userMessage }],
    });

    const reply = response.data.choices[0].message.content;
    res.send(reply);
  } catch (error) {
    console.error(error);
    res.status(500).send('مشکلی در ارتباط با OpenAI پیش آمد.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
