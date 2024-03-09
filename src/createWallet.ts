interface WalletObject {
  // wallet address hash
  walletAddress: String;
  // mnemonic words
  seed: String;
  // wallet hash
  generatedWallet: String;
}
export default function createWallet(test: boolean = true): WalletObject {
  const bip32 = require("bip32");
  const bip39 = require("bip39");
  const bitcoin = require("bitcoinjs-lib");

  // definir a rede
  // bitcoin - rede principal - mainnet
  // testnet - rede de teste - testnet
  const network = test ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

  // derivação de carteiras no HD
  const path = `m/49'/${test ? 1 : 0}'/0'/0`;

  // criando as palavras do mnemonic para a seed
  const mnemonic = bip39.generateMnemonic();
  if (!mnemonic) {
    throw new Error("Error generating mnemonic");
  }
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  // criando a raiz da carteira
  const root = bip32.fromSeed(seed, network);

  // criando uma conta - par pvt-pub keys
  const account = root.derivePath(path);
  // atribuindo um node
  const node = account.derive(0).derive(0);

  const btcAddress = bitcoin.payments.p2pkh({
    pubkey: node.publicKey,
    network: network,
  }).address;
  if (!btcAddress) {
    throw new Error("Failed to generate a valid Bitcoin address");
  }
  // console.log("Carteira gerada ");
  // console.log("Endereço  ", btcAddress);
  // console.log("Carteira gerada: ", node.toWIF());
  // console.log("seed ", mnemonic);
  return {
    walletAddress: btcAddress,
    seed: mnemonic,
    generatedWallet: node.toWIF(),
  };
}
