

export default function createWallet(test:boolean =true):object {
  const bip32 = require("bip32");
  const bip39 = require("bip39");
  const bitcoin = require("bitcoinjs-lib");

  // definir a rede
  // bitcoin - rede principal - mainnet
  // testnet - rede de teste - testnet
  const network = test? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

  // derivação de carteiras no HD
  const path = `m/49'/${test?1:0}'/0'/0`;

  // criando as palavras do mnemonic para a seed
  let mnemonic = bip39.generateMnemonic();
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  // criando a raiz da carteira
  let root = bip32.fromSeed(seed, network);

  // criando uma conta - par pvt-pub keys
  let account = root.derivePath(path);
  // atribuindo um node
  let node = account.derive(0).derive(0);

  let btcAddress = bitcoin.payments.p2pkh({
    pubkey: node.publicKey,
    network: network,
  }).address;
  // console.log("Carteira gerada ");
  // console.log("Endereço  ", btcAddress);
  // console.log("Carteira gerada: ", node.toWIF());
  // console.log("seed ", mnemonic);
  return {
    walletAdress: btcAddress,
    seed: mnemonic,
    generatedWallet: node.toWIF()
  }
}
