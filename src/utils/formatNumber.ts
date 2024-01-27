export default function formatNumber(number: number): string {

   return number.toString().padStart(2, '0');
   
}