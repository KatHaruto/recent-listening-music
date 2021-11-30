import "dotenv/config";
//import { createCollage } from "./createCollage";
import { createCollage } from "./createCollage";
import TwitterApi from "twitter-api-v2";
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
  const buffer: Buffer = await createCollage();
  try {
    const mediaId = await twitterClient.v1.uploadMedia(buffer, {
      type: "Buffer",
    });
    await twitterClient.v1.tweet(`Songs I listend to in ${yearMonth}`, {
      media_ids: mediaId,
    });
  } catch (err) {
    console.error(err);
  }
})();
