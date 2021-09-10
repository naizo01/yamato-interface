import { MCR } from '../../constants/yamato';

export function getCjpyPriceRank(cjpyPrice: number): number {
  const fixedPrice = Number(cjpyPrice.toFixed(2));
  const base = Math.floor(((fixedPrice - 1) / 2) * 100); // rank up per 0.02 YEN
  // 21 ranks
  if (base < -9) {
    return -10;
  } else if (base > 10) {
    return 10;
  }
  return base;
}

export function getEthPriceRank(changePercent: number): number {
  const base = Math.floor(changePercent * 100); // rank up per 1%
  // 91 ranks
  if (base < -45) {
    return -45;
  } else if (base > 45) {
    return 45;
  }
  return base;
}

export function getColorCodePerTcr(tcr: number): number {
  const base = Math.floor(tcr - MCR) * (124 / 190); // Min 236 - Mid 298 - Max 360
  // 125 ranks
  if (base > 124) {
    return 360;
  } else if (base <= 0) {
    return 236;
  }
  return base + 236;
}

export function getBrightnessPerEth(ethPriceRank: number): number {
  return 95 - Math.abs(ethPriceRank); // Max95% - Min50%
}

export function getChargeRankOfRedemption(chargeAmount: number): number {
  return getRank(chargeAmount, 500 * 10000) + 1; // rank up per 5000,000
}

export function getChargeRankOfSweep(chargeAmount: number): number {
  return getRank(chargeAmount, 100 * 10000); // rank up per 1000,000
}

function getRank(chargeAmount: number, baseNumber: number) {
  const base = Math.ceil(Math.ceil(chargeAmount) / baseNumber) + 1;
  // 10 ranks
  if (base === 0) {
    return 1;
  } else if (base > 10) {
    return 10;
  }
  return base;
}

export function getTcrRate(tcr: number) {
  if (tcr <= 0) {
    return 100;
  } else if (tcr > 500) {
    return 1;
  }
  return Math.abs(tcr / 5 - 99); // 0 to 500% fits in 100 to 1
}