import Number from '../src/Number';

const number = new Number(123);
const number2 = new Number(99);

console.log('number object  :', number);
console.log('convert to int :', number.toInt());
console.log('parse int :', parseInt(number));
console.log('max number :', Math.max(number2, number));
