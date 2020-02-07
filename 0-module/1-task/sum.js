/* eslint-disable */
const type = val => typeof val;
const isExist = arg => !(arg === undefined || arg === null || isNaN(arg));
const isNumber = (val) => {
  if (!isExist(val)) return false;
  if (type(val) !== 'number') return false;
  if (Object.getPrototypeOf(val).constructor.name !== 'Number') return false;
  return true;
};

function sum(a, b) {
  if(!isNumber(a)||!isNumber(b))throw TypeError();
  return a + b;
}

module.exports = sum;
