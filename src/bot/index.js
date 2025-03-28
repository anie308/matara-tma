import { Telegraf, Markup } from "telegraf";

const token = '7353274292:AAGLuHFq4Q7SsLZjJyUGj4pnknstrYzo7T0';
console.log(token, "token");
const bot = new Telegraf(token);

const getProfilePicture = async (userId) => {
};

bot.start(async (ctx) => {
    const username = ctx.from.username;
    const profilePicture = await getProfilePicture(ctx.from.id);
    const imageUrl =
        "https://res.cloudinary.com/wallnet/image/upload/v1726351913/bannerflow_pnnugl.png";
    console.log(username, "username");

    if (!username) {
        return ctx.reply(
            "Please set a username in your Telegram account settings to proceed."
        );
    } else {
        try {
            ctx.replyWithPhoto(
                { url: imageUrl },
                {
                    caption: `Welcome to Matara  Bot 🌻, @${ctx.from.username}! \nSunflower Brawl is Tap to Earn game, earn in-game currency, and eventually receive a real token that will have value on the exchange.`,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                Markup.button.url(
                                    "Join community",
                                    `https://t.me/sunflower_coin`
                                ),
                            ],
                            [
                                Markup.button.url(
                                    "Sunflower on X",
                                    "https://www.x.com/Sunflower_Coin"
                                ),
                            ],
                            [
                              Markup.button.webApp(
                                "Start now!",
                                `https://7dvfrf1x-5173.uks1.devtunnels.ms/`
                              ),
                            ],
                          
                        ],
                    },
                }
            )
        } catch (error) {
            console.log(error)
        }
    }
});


bot.launch();