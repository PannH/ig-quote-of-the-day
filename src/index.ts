import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const QUOTE_API_URL = 'https://zenquotes.io/api/today';

interface Quote {
   q: string;
   a: string;
   h: string;
}

(async () => {

   const { data }: { data: Quote[] } = await axios.get(QUOTE_API_URL);

   const quote = data[0];

   const content = quote.q;
   const author = quote.a;

})();