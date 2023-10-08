import axios from 'axios';

export default class Translator {

   private readonly apiKey: string;
   private readonly API_URL: string = 'https://api-free.deepl.com/v2/translate';

   constructor(apiKey: string) {

      this.apiKey = apiKey;
      
   }

   public async translate(text: string, targetLangCode: string): Promise<string> {

      return new Promise((resolve, reject) => {

         axios.post(this.API_URL, {
            text: [text],
            target_lang: targetLangCode
         }, {
            headers: {
               'Authorization': `DeepL-Auth-Key ${this.apiKey}`
            }
         })
            .then(({ data }) => resolve(data.translations[0].text))
            .catch((error) => reject(error));

      });

   }

}