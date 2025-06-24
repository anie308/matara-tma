import { Telegraf, Markup } from "telegraf";

const token = "7353274292:AAGLuHFq4Q7SsLZjJyUGj4pnknstrYzo7T0";
console.log(token, "token");
const bot = new Telegraf(token);

const getProfilePicture = async (userId) => {};

bot.start(async (ctx) => {
  const username = ctx.from.username;
  const profilePicture = await getProfilePicture(ctx.from.id);
  const imageUrl =
    "https://res.cloudinary.com/wallnet/image/upload/t_new-mat/v1743246776/MATARA_kqx0kj.png";
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
          caption: `🌟 Welcome to Matara! 🚀 @${ctx.from.username} \nMatara is more than just a cryptocurrency—it’s a movement! Built on blockchain technology, Matara helps you discover your true essence and live with purpose. 🌍✨ \n\n
🔹 Send & receive Matara seamlessly
🔹 Stake Matara 
🔹 Stay updated on community events
🔹 Join a purpose-driven network \n\n
Tap Get Started below and begin your journey with Matara today! 🔥👇`,
          reply_markup: {
            inline_keyboard: [
              [
                Markup.button.webApp(
                  "Start now!",
                  `https://matara-tma.vercel.app/`
                ),
              ],
              [
                Markup.button.url(
                  "Join community",
                  `https://t.me/FTLDOfficial`
                ),
              ],
            ],
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
});

bot.launch();
