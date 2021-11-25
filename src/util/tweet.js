require("dotenv").config();
const TwitterApi = require("twitter-api-v2").TwitterApi;
// Instanciate with desired auth type (here's Bearer v2 auth)
const tw = {
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
};
const twitterClient = new TwitterApi(tw);

// Play with the built in methods
(async () => {
  const yearMonth =
    new Date().getFullYear().toString() +
    "-" +
    (new Date().getMonth() + 1).toString();
  try {
    const mediaId = await twitterClient.v1.uploadMedia(
      `../../collage/image/${yearMonth}.jpg`
    );
    await twitterClient.v1.tweet(
      `Songs I heard in ${yearMonth}\nthis is automatically tweeted`,
      { media_ids: mediaId }
    );
  } catch (err) {
    console.error(err);
  }
})();
