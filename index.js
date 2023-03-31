require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { sizeModel } = require('./utils.js');

// URLs
const { API_ITEM_LINK, API_URL_AVAILABILITY, CHAT_ID, TOKEN } = process.env;
const POST_URL = `/webhook/${TOKEN}`;

// BOT
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Hello, welcome to my bot!');
});

bot.on('message', async (message) => {
  const article = message.text.split(' ')[0]; // '1119974001'
  const size = message.text.split(' ')[1]; // 34

  // we cut article we need to use it in API.json
  const itemID = article.substring(0, 7); // '1119974001' => '1119974'

  try {
    const response = await axios.get(`${API_URL_AVAILABILITY}${itemID}.json`);
    const items = response.data.availability; // array of items
    const itemFullID = `${article}${sizeModel[size]}`; // '1119974001002'

    const findItem = items.find((item) => item === itemFullID);

    const linkItem = `${API_ITEM_LINK}${article}`;

    if (findItem !== undefined) {
      const successText = `We have your size! ;)\n\nRead more: ${linkItem}`;
      await bot.sendMessage(CHAT_ID, successText, { parse_mode: 'HTML' });
    } else {
      const unsuccessText = `Sorry ${message.from.first_name}, your size is unavailabale now. We'll tell you if it's available again soon ;)`;
      await bot.sendMessage(CHAT_ID, unsuccessText, { parse_mode: 'HTML' });
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(CHAT_ID, 'Failed to fetch updates from cos.com');
  }
});
