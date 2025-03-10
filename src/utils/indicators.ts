export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const calculateRSI = (
  prices: number[],
  period: number = 14
): number[] => {
  if (prices.length < period + 1) {
    return Array(prices.length).fill(50);
  }

  const deltas = prices.slice(1).map((price, i) => price - prices[i]);
  const gains = deltas.map((d) => (d > 0 ? d : 0));
  const losses = deltas.map((d) => (d < 0 ? -d : 0));

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  const rsi = [100 - 100 / (1 + (avgGain || 0.00001) / (avgLoss || 0.00001))];

  for (let i = period; i < prices.length - 1; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    rsi.push(100 - 100 / (1 + (avgGain || 0.00001) / (avgLoss || 0.00001)));
  }

  return rsi;
};

export const calculateMACD = (
  prices: number[]
): {
  macdLine: number[];
  signalLine: number[];
  histogram: number[];
} => {
  if (prices.length < 26) {
    const mockData = Array(prices.length).fill(0);
    return {
      macdLine: mockData,
      signalLine: mockData,
      histogram: mockData,
    };
  }

  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macdLine = ema12.map((v, i) => v - ema26[i]);
  const signalLine = calculateEMA(macdLine, 9);
  const histogram = macdLine.map((v, i) => v - signalLine[i]);

  return { macdLine, signalLine, histogram };
};

function calculateEMA(prices: number[], period: number): number[] {
  if (prices.length === 0) return [];

  const k = 2 / (period + 1);
  const ema = [prices[0]];

  for (let i = 1; i < prices.length; i++) {
    ema.push(prices[i] * k + ema[i - 1] * (1 - k));
  }

  return ema;
}
