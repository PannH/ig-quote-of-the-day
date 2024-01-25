import dotenv from 'dotenv';
import axios from 'axios';
import Translator from './classes/Translator';
import { IgApiClient } from 'instagram-private-api';
import buildImage from './utils/buildImage';
import { Logger } from 'beautify-logs';
import { readFileSync } from 'fs';

const logger = new Logger();

dotenv.config();

const { IG_USERNAME, IG_PASSWORD, DEEPL_API_KEY } = process.env as Record<string, string>;
const QUOTE_API_URL = 'https://zenquotes.io/api/today';

const ig = new IgApiClient();

ig.state.generateDevice(IG_USERNAME);

interface Quote {
   q: string;
   a: string;
   h: string;
}

const translator = new Translator(DEEPL_API_KEY);

(async () => {

   logger.debug('Simulating pre login flow...');
   await ig.simulate.preLoginFlow();

   logger.debug('Logging in...');
   await ig.account.login(IG_USERNAME, IG_PASSWORD);

   logger.debug('Fetching the quote...')
   const { data }: { data: Quote[] } = await axios.get(QUOTE_API_URL);

   const quoteData = data[0];

   logger.debug('Translating the quote...');
   const quoteTranslation = await translator.translate(quoteData.q, 'fr');

   logger.debug('Building the image...');
   await buildImage(quoteData.q, quoteTranslation, quoteData.a);

   logger.debug('Fetching the image as buffer...');
   const imageBuffer = readFileSync('image.jpeg');

   logger.debug('Publishing the story...');
   await ig.publish.story({
      file: imageBuffer,
      toBesties: true
   });

   logger.debug('Done!');

})();