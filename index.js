const telegramApi = require('node-telegram-bot-api')

const { gameOptions, againOptions, againWinOptions } = require('./options')

const config = require('./config.json');

const token = config.token;

const bot = new telegramApi(token, {polling: true})

const chats = {}

const startgame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 1 до 9, а тебе нужно отгадать)`)
    let RandomNumber = Math.floor(Math.random() * 10)
    if(RandomNumber === 0) {
        RandomNumber++
    }
    chats[chatId] = RandomNumber;
    console.log(RandomNumber);
    await  bot.sendMessage(chatId, `Отгадывай`, gameOptions)
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        bot.setMyCommands (
            [
                {command: '/start', description: 'Поздороваться'},
                {command: '/info', description: 'Получить информацию обо мне'},
                {command: '/game', description: 'Сыграть в игру'}
            ]
        )
    
        if(text === '/start') {
            await bot.sendMessage(chatId, `Привет, ${msg.from.username}, я пушистый программист, давай дружить`)
            return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/5.webp')
        }
    
        if(text === '/info') {
            await bot.sendMessage(chatId, `Я хакнул твое имя лапками. Тебя зовут ${msg.from.username}`)
            return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/6.webp')
        }

        if(text === '/game') { 
            return startgame(chatId)
        }

        await bot.sendMessage(chatId, `Ты написал котику "${msg.text}", но он тебя не понял. К сожалению я его еще не всем командам обучил :( ... Попробуй воспользоваться командой "/info" или сыграть с котиком в игру с помощью команды "/game"`)
        return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/192/99.webp')

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if(data === '/again') {
            return startgame(chatId)
        }

        if(data === '/againwin') {
            const RandomNumberCat = Math.floor(Math.random() * 10000 / 2)
            return bot.sendPhoto(chatId, `https://d2ph5fj80uercy.cloudfront.net/05/cat${RandomNumberCat}.jpg`)
        }

        if(`${data}` !== `${chats[chatId]}`) {
            // await editMessageReplyMarkup(chat_id = chatId, message_id = NULL,
            //     inline_message_id = NULL, reply_markup = JSON.stringify({
            //         hide_keyboard: true
            //     }))

            // await bot.sendMessage({
            //     chat_id: chatId,
            //     text: "ekvdm",
            //     reply_markup: JSON.stringify({
            //         hide_keyboard: true
            //     })
            // }); 
            return bot.sendMessage(chatId, `Это была цифра ${chats[chatId]}, нажми на нее или сыграй еще разок)`, againOptions)
            

        } else {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал, это была цифра ${chats[chatId]}, теперь ты можешь получить фото случайно сгенерированого нейросетью котика :)`, againWinOptions)
        }
    })
}

start()
