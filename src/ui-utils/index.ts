import { Decimal } from "@cosmjs/math";
import { Coin } from "@cosmjs/stargate";

export function ellideMiddle(str: string, maxOutLen: number): string {
  if (str.length <= maxOutLen) {
    return str;
  }
  const ellide = "…";
  const frontLen = Math.ceil((maxOutLen - ellide.length) / 2);
  const tailLen = Math.floor((maxOutLen - ellide.length) / 2);
  return str.slice(0, frontLen) + ellide + str.slice(str.length - tailLen, str.length);
}

export function ellideRight(str: string, maxOutLen: number): string {
  if (str.length <= maxOutLen) {
    return str;
  }
  const ellide = "…";
  const frontLen = maxOutLen - ellide.length;
  return str.slice(0, frontLen) + ellide;
}

// NARROW NO-BREAK SPACE (U+202F)
const thinSpace = "\u202F";

function printableCoin(coin: Coin): string {
  if (coin.denom.startsWith("u")) {
    const ticker = coin.denom.slice(1).toUpperCase();
    return Decimal.fromAtomics(coin.amount ?? "0", 6).toString() + thinSpace + ticker;
  } else {
    return coin.amount + thinSpace + coin.denom;
  }
}

export function printableBalance(balance: readonly Coin[]): string {
  if (balance.length === 0) return "–";
  return balance.map(printableCoin).join(", ");
}
