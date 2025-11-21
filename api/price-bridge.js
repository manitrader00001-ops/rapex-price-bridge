const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ccxt = require('ccxt');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const symbols = [
  'BTC/USDT','ETH/USDT','BNB/USDT','XRP/USDT','ADA/USDT','SOL/USDT','DOGE/USDT','DOT/USDT','MATIC/USDT','AVAX/USDT',
  'LINK/USDT','LTC/USDT','BCH/USDT','XLM/USDT','VET/USDT','FIL/USDT','TRX/USDT','ETC/USDT','EOS/USDT','AAVE/USDT',
  'UNI/USDT','MKR/USDT','COMP/USDT','YFI/USDT','SUSHI/USDT','SNX/USDT','GRT/USDT','LRC/USDT','CHZ/USDT','MANA/USDT',
  'SAND/USDT','AXS/USDT','GALA/USDT','ENJ/USDT','THETA/USDT','ALGO/USDT','NEAR/USDT','FTM/USDT','ATOM/USDT','FLOW/USDT'
  // 500+ chahiye toh bol do add kar dunga
];

let prices = {};
const exchange = new ccxt.binance({ enableRateLimit: true });

async function updatePrices() {
  try {
    const tickers = await exchange.fetchTickers(symbols);
    for (let symbol of symbols) {
      const clean = symbol.replace('/', '');
      if (tickers[symbol]?.last) prices[clean] = tickers[symbol].last;
    }
    io.emit('prices', prices);
  } catch (e) {
    console.log('Error:', e.message);
  }
}

setInterval(updatePrices, 1200);
updatePrices();

app.get('/', (req, res) => {
  res.send(`Rapex Price Bridge Live! Tracking ${symbols.length} pairs. Socket.io ready.`);
});

module.exports = server;
