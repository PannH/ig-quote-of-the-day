import { createCanvas, loadImage, registerFont } from 'canvas';
import { readdirSync, writeFileSync } from 'fs';
import wrapText from './wrapText';
import randomElement from './randomElement';

export default async function buildImage(quote: string, quoteTranslation: string, author: string) {

   const canvas = createCanvas(1080, 1920);
   const ctx = canvas.getContext('2d');

   const bgImagesDirectory = 'assets/images';
   const bgImageFiles = readdirSync(bgImagesDirectory);
   const randomBgImageFile = randomElement(bgImageFiles);
   const bgImage = await loadImage(`${bgImagesDirectory}/${randomBgImageFile}`);

   ctx.drawImage(bgImage, 0, 0);

   ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   const container = {
      cornerRadius: 10,
      x: 30,
      y: 30,
      width: canvas.width - 60,
      height: canvas.height - 125
   };

   ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
   ctx.beginPath();
   ctx.moveTo(container.x + container.cornerRadius, container.y);
   ctx.lineTo(container.x + container.width - container.cornerRadius, container.y);
   ctx.arcTo(container.x + container.width, container.y, container.x + container.width, container.y + container.cornerRadius, container.cornerRadius);
   ctx.lineTo(container.x + container.width, container.y + container.height - container.cornerRadius);
   ctx.arcTo(container.x + container.width, container.y + container.height, container.x + container.width - container.cornerRadius, container.y + container.height, container.cornerRadius);
   ctx.lineTo(container.x + container.cornerRadius, container.y + container.height);
   ctx.arcTo(container.x, container.y + container.height, container.x, container.y + container.height - container.cornerRadius, container.cornerRadius);
   ctx.lineTo(container.x, container.y + container.cornerRadius);
   ctx.arcTo(container.x, container.y, container.x + container.cornerRadius, container.y, container.cornerRadius);
   ctx.closePath();
   ctx.fill();

   const canvasMiddleWidth = canvas.width / 2;
   const canvasMiddleHeight = canvas.height / 2;

   ctx.font = '82px Montserrat';
   ctx.textAlign = 'center';
   ctx.fillStyle = 'white';
   ctx.fillText('Quote of The Day', canvasMiddleWidth, 160);

   ctx.font = '58px Montserrat';
   wrapText(ctx, `“${quote}”`, canvasMiddleWidth, canvasMiddleHeight - (95 * (quote.length / 25)) / 2, canvas.width - 200, 75);

   ctx.font = '48px Montserrat';
   ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
   wrapText(ctx, quoteTranslation, canvasMiddleWidth, canvasMiddleHeight + (95 * (quoteTranslation.length / 25)) / 2, canvas.width - 200, 62);

   ctx.font = '50px Montserrat';
   ctx.fillText(author, canvasMiddleWidth, canvas.height - 140);

   ctx.font = '38px Montserrat';
   ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
   ctx.fillText(`Automated post (${new Date().toLocaleDateString('fr-FR')})`, canvasMiddleWidth, canvas.height - 35);

   const buffer = canvas.toBuffer('image/jpeg');
   writeFileSync('image.jpeg', buffer);
   
}