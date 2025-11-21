const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const ccxt = require('ccxt');

const symbols = [
  'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'XRP/USDT', 'ADA/USDT', 'SOL/USDT', 'DOGE/USDT', 'DOT/USDT', 'MATIC/USDT', 'AVAX/USDT',
  'LINK/USDT', 'LTC/USDT', 'BCH/USDT', 'XLM/USDT', 'VET/USDT', 'FIL/USDT', 'TRX/USDT', 'ETC/USDT', 'EOS/USDT', 'AAVE/USDT',
  'UNI/USDT', 'MKR/USDT', 'COMP/USDT', 'YFI/USDT', 'SUSHI/USDT', 'SNX/USDT', 'GRT/USDT', 'LRC/USDT', 'CHZ/USDT', 'MANA/USDT',
  'SAND/USDT', 'AXS/USDT', 'GALA/USDT', 'ENJ/USDT', 'THETA/USDT', 'TFUEL/USDT', 'ALGO/USDT', 'XTZ/USDT', 'HBAR/USDT', 'EGLD/USDT',
  'ICP/USDT', 'NEO/USDT', 'ZEC/USDT', 'DASH/USDT', 'WAVES/USDT', 'ZIL/USDT', 'ONT/USDT', 'IOTA/USDT', 'BAT/USDT', 'ENJ/USDT',
  'KSM/USDT', 'NEAR/USDT', 'FTM/USDT', 'ATOM/USDT', 'FLOW/USDT', 'ALGO/USDT', 'ONE/USDT', 'CHZ/USDT', 'CRV/USDT', '1INCH/USDT',
  'ROSE/USDT', 'RUNE/USDT', 'QTUM/USDT', 'ZRX/USDT', 'KNC/USDT', 'OMG/USDT', 'BAND/USDT', 'BAL/USDT', 'YGG/USDT', 'STORJ/USDT'
  // Yeh 60+ hain — 500 tak pahunchane ke liye Binance API se full list fetch kar sakte hain, lekin start ke liye yeh enough. Baaki add karne hain toh bolo.
];

let prices = {};
const exchange = new ccxt.binance({ enableRateLimit: true });

async function updatePrices() {
  try {
    const tickers = await exchange.fetchTickers(symbols);
    for (let symbol of symbols) {
      const clean = symbol.replace('/', '');
      if (tickers[symbol] && tickers[symbol].last) {
        prices[clean] = tickers[symbol].last;
      }
    }
    io.emit('prices', prices);
    console.log(`Updated ${Object.keys(prices).length} prices at ${new Date().toISOString()}`);
  } catch (err) {
    console.log('Price fetch error:', err.message);
  }
}

setInterval(updatePrices, 1200); // 1.2 sec update
updatePrices(); // Immediate start

app.get('/', (req, res) => res.send(`Rapex Price Bridge Live! Tracking ${symbols.length} pairs.`));

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Price bridge live on port ${PORT}`);
});
