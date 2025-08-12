import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { Buffer } from 'buffer'

globalThis.Buffer = Buffer

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)




// import { ethers } from 'ethers';

// const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_KEY');
// const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // USDT on Ethereum
// const erc20Abi = [
//   'event Transfer(address indexed from, address indexed to, uint value)'
// ];

// export async function getUSDTTransactionDetails(txHash) {
//   try {
//     const tx = await provider.getTransaction(txHash);
//     const receipt = await provider.getTransactionReceipt(txHash);
//     const block = await provider.getBlock(tx.blockNumber);

//     const iface = new ethers.Interface(erc20Abi);
//     const logs = receipt.logs
//       .map(log => {
//         try {
//           return iface.parseLog(log);
//         } catch {
//           return null;
//         }
//       })
//       .filter(Boolean);

//     const transferLog = logs.find(log => log.name === 'Transfer');
//     if (!transferLog) return { error: 'No USDT transfer found' };

//     return {
//       from: transferLog.args.from,
//       to: transferLog.args.to,
//       amount: ethers.formatUnits(transferLog.args.value, 6), // USDT has 6 decimals
//       timestamp: new Date(block.timestamp * 1000).toISOString()
//     };
//   } catch (err) {
//     return { error: err.message };
//   }
// }





// import { Connection, PublicKey } from '@solana/web3.js';

// const connection = new Connection('https://api.mainnet-beta.solana.com');
// const usdcMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

// export async function getUSDCSolanaTx(txSignature) {
//   try {
//     const tx = await connection.getParsedTransaction(txSignature, { maxSupportedTransactionVersion: 0 });
//     if (!tx) return { error: 'Transaction not found' };

//     const blockTime = tx.blockTime ? new Date(tx.blockTime * 1000).toISOString() : 'N/A';

//     const transferInstr = tx.transaction.message.instructions.find(i => {
//       return (
//         i.program === 'spl-token' &&
//         i.parsed?.type === 'transfer' &&
//         i.parsed?.info?.mint === usdcMint.toString()
//       );
//     });

//     if (!transferInstr) return { error: 'No USDC transfer found' };

//     const { source, destination, amount } = transferInstr.parsed.info;

//     return {
//       from: source,
//       to: destination,
//       amount: parseFloat(amount) / 1e6, // USDC has 6 decimals
//       timestamp: blockTime
//     };
//   } catch (err) {
//     return { error: err.message };
//   }
// }
