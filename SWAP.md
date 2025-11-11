# Swap Service - Frontend Integration Guide

This guide provides comprehensive documentation for integrating the BSC token swap service into your frontend application.

## Table of Contents
- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Request/Response Examples](#requestresponse-examples)
- [Error Handling](#error-handling)
- [Status Codes](#status-codes)
- [Integration Examples](#integration-examples)
- [Best Practices](#best-practices)

## Overview

The swap service allows users to swap tokens on the Binance Smart Chain (BSC) using PancakeSwap. The service:
- Executes swaps immediately when requested
- Handles gas fee checks automatically
- Validates token balances before swapping
- Logs all transactions automatically
- Supports token-to-token, token-to-BNB, and BNB-to-token swaps

## Base URL

```
Production: https://your-api-domain.com/api/swap
Development: http://localhost:4000/api/swap
```

## Authentication

Currently, the swap endpoints do not require authentication tokens. However, you must provide the `username` in the request body to identify the user.

## API Endpoints

### 1. Create Swap Request

**Endpoint:** `POST /api/swap`

**Description:** Creates a swap request and executes it immediately on-chain.

**Request Body:**
```typescript
{
  username: string;              // Required: User's username
  tokenIn: string;               // Required: Token address to swap from (use WBNB address for BNB: 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c)
  tokenOut: string;              // Required: Token address to swap to
  tokenInSymbol?: string;        // Optional: Token symbol (e.g., "USDT", "BNB")
  tokenOutSymbol?: string;       // Optional: Token symbol (e.g., "BNB", "BUSD")
  amountIn: string;              // Required: Amount to swap (as string, e.g., "100.0")
  amountOut?: string;            // Optional: Expected output amount
  amountOutMin?: string;         // Optional: Minimum output amount (auto-calculated if not provided)
  slippageTolerance?: number;    // Optional: Slippage tolerance in % (default: 0.5)
  deadline?: number;             // Optional: Unix timestamp deadline (default: 5 minutes from now)
}
```

**Success Response (201):**
```typescript
{
  message: "Swap request created and executed successfully",
  data: {
    swapRequestId: string;
    walletAddress: string;
    tokenIn: string;
    tokenOut: string;
    tokenInSymbol: string;
    tokenOutSymbol: string;
    amountIn: string;
    amountOut: string;
    amountOutMin: string;
    feePercentage: number;
    feeAmount: string;
    feeRecipientAddress: string;
    status: "completed" | "failed";
    transactionHash?: string;    // Present if swap succeeded
    createdAt: string;
    completedAt?: string;         // Present if swap succeeded
    errorMessage?: string;        // Present if swap failed
  }
}
```

**Error Responses:**
- `400`: Validation error (missing fields, invalid amounts, etc.)
- `404`: User not found
- `500`: Internal server error

---

### 2. Get User Swap Requests

**Endpoint:** `GET /api/swap/user?username={username}`

**Description:** Retrieves all swap requests for a specific user.

**Query Parameters:**
- `username` (required): User's username

**Success Response (200):**
```typescript
{
  data: Array<{
    _id: string;
    userId: string;
    walletAddress: string;
    chain: "BSC";
    tokenIn: string;
    tokenOut: string;
    tokenInSymbol: string;
    tokenOutSymbol: string;
    amountIn: string;
    amountOut: string;
    amountOutMin: string;
    feePercentage: number;
    feeAmount: string;
    feeRecipientAddress: string;
    status: "pending" | "processing" | "completed" | "failed" | "cancelled";
    transactionHash?: string;
    slippageTolerance: number;
    deadline: number;
    errorMessage?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  message: "Swap requests fetched successfully";
}
```

---

### 3. Get Swap Request by ID

**Endpoint:** `GET /api/swap/{swapRequestId}`

**Description:** Retrieves a specific swap request by its ID.

**Path Parameters:**
- `swapRequestId`: MongoDB ObjectId of the swap request

**Success Response (200):**
```typescript
{
  data: {
    // Same structure as swap request object above
    userId: {
      _id: string;
      username: string;
      walletAddress: string;
    };
  };
  message: "Swap request fetched successfully";
}
```

---

## Request/Response Examples

### Example 1: Swap USDT to BNB

```typescript
// Request
const swapUSDTtoBNB = async () => {
  const response = await fetch('http://localhost:4000/api/swap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'john_doe',
      tokenIn: '0x55d398326f99059fF775485246999027B3197955', // USDT address
      tokenOut: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB address
      tokenInSymbol: 'USDT',
      tokenOutSymbol: 'BNB',
      amountIn: '100.0',
      slippageTolerance: 0.5
    })
  });

  const result = await response.json();
  console.log(result);
};

// Response
{
  "message": "Swap request created and executed successfully",
  "data": {
    "swapRequestId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "tokenIn": "0x55d398326f99059ff775485246999027b3197955",
    "tokenOut": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    "tokenInSymbol": "USDT",
    "tokenOutSymbol": "BNB",
    "amountIn": "100.0",
    "amountOut": "0.25",
    "amountOutMin": "0.24875",
    "feePercentage": 1.0,
    "feeAmount": "1.000000000000000000",
    "feeRecipientAddress": "0x...",
    "status": "completed",
    "transactionHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "completedAt": "2024-01-15T10:30:05.000Z"
  }
}
```

### Example 2: Swap BNB to Token

```typescript
// Request
const swapBNBtoToken = async () => {
  const response = await fetch('http://localhost:4000/api/swap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'john_doe',
      tokenIn: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB address
      tokenOut: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', // BUSD address
      tokenInSymbol: 'BNB',
      tokenOutSymbol: 'BUSD',
      amountIn: '1.0',
      slippageTolerance: 1.0
    })
  });

  const result = await response.json();
  return result;
};
```

### Example 3: Get User's Swap History

```typescript
const getUserSwaps = async (username: string) => {
  const response = await fetch(
    `http://localhost:4000/api/swap/user?username=${username}`
  );
  
  const result = await response.json();
  return result.data; // Array of swap requests
};
```

## Error Handling

### Common Error Scenarios

1. **Insufficient Balance**
```json
{
  "message": "Insufficient token balance. Balance: 50.0, Required: 100.0"
}
```

2. **Insufficient Gas**
```json
{
  "message": "Insufficient BNB for gas fees. Balance: 0.001 BNB, Required: 0.01 BNB"
}
```

3. **Invalid Amount**
```json
{
  "message": "Invalid amountIn. Must be a positive number."
}
```

4. **User Not Found**
```json
{
  "message": "User not found"
}
```

5. **Wallet Not Set Up**
```json
{
  "message": "User wallet address not found. Please ensure wallet is set up."
}
```

6. **Swap Execution Failed**
```json
{
  "message": "Swap request created but execution failed",
  "data": {
    "status": "failed",
    "errorMessage": "Transaction reverted: insufficient liquidity"
  }
}
```

## Status Codes

| Status Code | Meaning | Description |
|------------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Swap request created successfully |
| 400 | Bad Request | Validation error or invalid input |
| 404 | Not Found | User or swap request not found |
| 500 | Internal Server Error | Server error |

## Integration Examples

### React/TypeScript Example

```typescript
import { useState } from 'react';

interface SwapRequest {
  username: string;
  tokenIn: string;
  tokenOut: string;
  tokenInSymbol?: string;
  tokenOutSymbol?: string;
  amountIn: string;
  slippageTolerance?: number;
}

const SwapComponent = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const executeSwap = async (swapData: SwapRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:4000/api/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(swapData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Swap failed');
      }

      setResult(data);
      
      // Check if swap was successful
      if (data.data.status === 'completed' && data.data.transactionHash) {
        console.log('Swap successful!', data.data.transactionHash);
        // Show success message
        // Redirect to transaction view
      } else if (data.data.status === 'failed') {
        throw new Error(data.data.errorMessage || 'Swap execution failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your swap form UI */}
      <button 
        onClick={() => executeSwap({
          username: 'user123',
          tokenIn: '0x...',
          tokenOut: '0x...',
          amountIn: '100.0'
        })}
        disabled={loading}
      >
        {loading ? 'Swapping...' : 'Swap'}
      </button>
      
      {error && <div className="error">{error}</div>}
      {result && <div className="result">{JSON.stringify(result, null, 2)}</div>}
    </div>
  );
};
```

### Vue.js Example

```vue
<template>
  <div>
    <form @submit.prevent="executeSwap">
      <input v-model="swapData.username" placeholder="Username" required />
      <input v-model="swapData.tokenIn" placeholder="Token In Address" required />
      <input v-model="swapData.tokenOut" placeholder="Token Out Address" required />
      <input v-model="swapData.amountIn" placeholder="Amount" required />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Swapping...' : 'Swap' }}
      </button>
    </form>
    
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="result" class="result">
      <p>Status: {{ result.data.status }}</p>
      <p v-if="result.data.transactionHash">
        Transaction: {{ result.data.transactionHash }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(false);
const error = ref<string | null>(null);
const result = ref<any>(null);

const swapData = ref({
  username: '',
  tokenIn: '',
  tokenOut: '',
  amountIn: '',
  slippageTolerance: 0.5
});

const executeSwap = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch('http://localhost:4000/api/swap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(swapData.value)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message);
    }
    
    result.value = data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error';
  } finally {
    loading.value = false;
  }
};
</script>
```

### JavaScript/Node.js Example

```javascript
const axios = require('axios');

async function createSwap(username, tokenIn, tokenOut, amountIn) {
  try {
    const response = await axios.post('http://localhost:4000/api/swap', {
      username,
      tokenIn,
      tokenOut,
      amountIn,
      slippageTolerance: 0.5
    });
    
    console.log('Swap Result:', response.data);
    
    if (response.data.data.status === 'completed') {
      console.log('Transaction Hash:', response.data.data.transactionHash);
      return response.data.data;
    } else {
      throw new Error(response.data.data.errorMessage);
    }
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data.message);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

// Usage
createSwap(
  'john_doe',
  '0x55d398326f99059fF775485246999027B3197955', // USDT
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB
  '100.0'
);
```

## Best Practices

### 1. Pre-Swap Validation

Before calling the swap API, validate on the frontend:

```typescript
const validateSwap = (swapData: SwapRequest): string | null => {
  if (!swapData.username) return 'Username is required';
  if (!swapData.tokenIn || !swapData.tokenOut) return 'Token addresses required';
  if (!swapData.amountIn || parseFloat(swapData.amountIn) <= 0) {
    return 'Valid amount required';
  }
  if (swapData.slippageTolerance && (swapData.slippageTolerance < 0 || swapData.slippageTolerance > 50)) {
    return 'Slippage tolerance must be between 0 and 50%';
  }
  return null;
};
```

### 2. Loading States

Always show loading states during swap execution:

```typescript
const [swapStatus, setSwapStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
```

### 3. Error Handling

Implement comprehensive error handling:

```typescript
try {
  const result = await executeSwap(swapData);
  if (result.data.status === 'failed') {
    // Handle swap failure
    showError(result.data.errorMessage);
  }
} catch (error) {
  // Handle network/API errors
  if (error.response?.status === 400) {
    showError(error.response.data.message);
  } else {
    showError('Network error. Please try again.');
  }
}
```

### 4. Transaction Tracking

After a successful swap, track the transaction:

```typescript
if (result.data.transactionHash) {
  // Store transaction hash
  localStorage.setItem('lastSwapTx', result.data.transactionHash);
  
  // Optionally poll for confirmation
  pollTransactionStatus(result.data.transactionHash);
}
```

### 5. User Feedback

Provide clear feedback to users:

```typescript
const showSwapResult = (result: any) => {
  if (result.data.status === 'completed') {
    toast.success(`Swap successful! Transaction: ${result.data.transactionHash.slice(0, 10)}...`);
  } else {
    toast.error(`Swap failed: ${result.data.errorMessage}`);
  }
};
```

### 6. Token Address Constants

Store common token addresses as constants:

```typescript
export const BSC_TOKENS = {
  WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  USDT: '0x55d398326f99059fF775485246999027B3197955',
  BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  // Add more tokens...
};
```

### 7. Amount Formatting

Format amounts properly:

```typescript
const formatAmount = (amount: string, decimals: number = 18): string => {
  return parseFloat(amount).toFixed(decimals);
};
```

## Important Notes

1. **BNB Swaps**: Use WBNB address (`0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`) when swapping BNB
2. **Gas Fees**: Users must have sufficient BNB for gas fees (minimum ~0.01 BNB recommended)
3. **Token Balances**: Users must have sufficient token balance before swapping
4. **Immediate Execution**: Swaps execute immediately when requested - no need to poll for status
5. **Transaction Hash**: Always check for `transactionHash` in the response to confirm success
6. **Fee Structure**: A fee (default 1%) is automatically deducted from the swap amount

## Support

For issues or questions, please contact the development team or refer to the API documentation.

---

**Last Updated:** January 2024
**API Version:** 1.0

