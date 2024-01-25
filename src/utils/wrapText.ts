export default function wrapText(context: any, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {

   const words = text.split(/ +/g);

   let line = '';
   for (let i = 0; i < words.length; i++) {

      const testLine = line + words[i] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {

         context.fillText(line, x, y);
         line = words[i] + ' ';
         y += lineHeight;

      } else {

         line = testLine;

      }

   }
   
   context.fillText(line, x, y);

}