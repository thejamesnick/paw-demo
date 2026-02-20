export interface SwapParams {
  from: string;
  to: string;
  amount: number;
  slippage?: number;
}

export interface SwapResult {
  signature: string;
  inputAmount: number;
  outputAmount: number;
  from: string;
  to: string;
}

export interface SendParams {
  to: string;
  amount: number;
}

export interface SendResult {
  signature: string;
  amount: number;
  recipient: string;
}
