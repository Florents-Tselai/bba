const path = require('path');
const fs = require('fs');
const solc = require('solc');

const sourcePath = path.resolve(__dirname, './Document.sol');
const source = fs.readFileSync(sourcePath, 'utf8');

console.log('compiling ...');

const compiled = solc.compile(source, 1);

console.log('finished compiling ...');

// console.log(compiled);
module.exports = compiled.contracts[':Document'];

// '[{"constant":false,"inputs":[{"name":"newMessage","type":"string"}],"name":"setMessage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMessage","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"message","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"newMessage","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]'
