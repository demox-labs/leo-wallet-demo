import { JSONRPCClient } from 'json-rpc-2.0';
import { AleoTransactionResponse } from './types';

export enum AleoChainId {
  Mainnet = 'mainnet',
  TestnetBeta = 'testnetbeta',
  Canary = 'canary',
  Localnet = 'localnet',
}

export const ALEO_API_BASE_URLS = new Map([
  [AleoChainId.Mainnet, 'https://mainnet.aleorpc.com'],
  [AleoChainId.TestnetBeta, 'https://testnetbeta.aleorpc.com'],
  [AleoChainId.Localnet, 'http://localhost:3000'],
]);

export const getClient = (chainId: AleoChainId) => {
  const apiUrl = ALEO_API_BASE_URLS.get(chainId)!;
  const client = new JSONRPCClient((jsonRPCRequest: any) =>
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ ...jsonRPCRequest }),
    }).then((response: any) => {
      if (response.status === 200) {
        // Use client.receive when you received a JSON-RPC response.
        return response
          .json()
          .then((jsonRPCResponse: any) => client.receive(jsonRPCResponse));
      } else if (jsonRPCRequest.id !== undefined) {
        return Promise.reject(new Error(response.statusText));
      }
    })
  );
  return client;
};

export async function getTransaction(
  chainId: AleoChainId,
  transactionId: string
): Promise<AleoTransactionResponse> {
  const client = getClient(chainId);

  try {
    const aleoTransaction = (await client.request('aleoTransaction', {
      id: transactionId,
    })) as AleoTransactionResponse;
    return aleoTransaction;
  } catch (e: any) {
    throw new Error(`Transaction not found: ${transactionId} with error: ${e}`);
  }
}
