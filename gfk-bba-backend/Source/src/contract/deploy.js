const path = require('path');
const fs = require('fs');
require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

function readFile(relativePath) {
  const sourcePath = path.resolve(__dirname, relativePath);
  return fs.readFileSync(sourcePath, 'utf8');
}

const interface = readFile('./Document.api.json');
const bytecode = readFile('./Document.bytecode');

console.log('interface vorhanden? ', !!interface);
console.log('bytecode vorhanden?  ', !!bytecode);
console.log('MEMONIC vorhanden?   ', !!process.env.MEMONIC);
console.log('INFURA_URL vorhanden?', !!process.env.INFURA_URL);

const provider = new HDWalletProvider(
  process.env.MEMONIC,
  process.env.INFURA_URL,
);

const web3 = new Web3(provider);

// wrap the await calls in a function, so we can use the await syntax.
export async function deploy(hashedData, arrayOfLinks) {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [hashedData, arrayOfLinks || []],
    })
    .send({
      gas: '1000000',
      from: accounts[0],
    });

  // console.log(interface);
  console.log('Contract deployed to', result.options.address);
  // deploy('XXXXXXXXXXXX_ELCH_XXXXXXXXXXXXXXX', [
}
//   '0x33be153566a5f84698ECc68274E029A37742f742',
//   '0x77D91E696fAf7Cd719D7F714cf105D4e3dE96cDD',
// ]);

// Attempting to deploy from account 0x3faE248495B28AD00813758e532c5f48bA44eA3E
// Contract deployed to 0x33be153566a5f84698ECc68274E029A37742f742
