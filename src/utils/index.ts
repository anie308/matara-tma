import { ethers } from "ethers";

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

export const fetchTokenBalances = async (provider: any, userAddress: any, tokens: any) => {
  const balances = {} as any;
  for (const token of tokens) {
    try {
      if (token.address === "native") {
        const balance = await provider.getBalance(userAddress);
        balances[token.symbol] = Number(ethers.formatEther(balance));
      } else {
        const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
        const [rawBal, decimals] = await Promise.all([
          contract.balanceOf(userAddress),
          contract.decimals()
        ]);
        balances[token.symbol] = Number(ethers.formatUnits(rawBal, decimals));
      }
    } catch (err) {
      balances[token.symbol] = 0;
    }
  }
  return balances;
};



export function addSpacesToNumber(number: number) {
  const numString = number?.toString();
  const parts = [];
  let i = numString?.length;

  while (i > 0) {
    parts.unshift(numString.substring(Math.max(0, i - 3), i));
    i -= 3;
  }

  return parts.join(" ");
}