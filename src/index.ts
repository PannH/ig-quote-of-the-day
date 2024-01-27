import Translator from './classes/Translator';
import buildImage from './utils/buildImage';
import formatNumber from './utils/formatNumber';
import dotenv from 'dotenv';
import axios from 'axios';
import { IgApiClient } from 'instagram-private-api';
import { Logger } from 'beautify-logs';
import { readFileSync } from 'fs';
import { CronJob } from 'cron';

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

logger.debug('Creating the cron job...');

const job = new CronJob('0 0 0 * * *', async () => {

   logger.debug('---------- Cron job execution ----------');

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

   logger.debug('----------------------------------------');

}, null, true, 'Europe/Paris');

const { day, month, year, hour, second, minute } = job.nextDate();
logger.debug(`Next cron job execution: ${formatNumber(day)}/${formatNumber(month)}/${formatNumber(year)} at ${formatNumber(hour)}:${formatNumber(minute)}:${formatNumber(second)}`);