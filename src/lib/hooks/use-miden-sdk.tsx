import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import * as MidenSdk from '@demox-labs/miden-sdk/dist/index';

export interface MidenSdkContextState {
  isLoading: boolean;
  Miden: typeof MidenSdk;
  client: MidenSdk.WebClient | null;
  faucetId: MidenSdk.AccountId | null;
  createFaucet: () => Promise<void>;
}

const defaultContext: {
  isLoading: boolean;
  Miden: any;
} = {
  isLoading: true,
  Miden: null,
};

export const MidenSdkContext = createContext<MidenSdkContextState>(
  defaultContext as MidenSdkContextState
);

export const useMidenSdk = (): MidenSdkContextState => {
  return useContext(MidenSdkContext);
};

export interface MidenSdkProviderProps {
  children: React.ReactNode;
}

export const MidenSdkProvider: FC<MidenSdkProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [Miden, setMiden] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [faucetId, setFaucetId] = useState<any>(null);

  const loadSdk = useCallback(async () => {
    if (!isLoading && Miden !== null) return;
    const sdk: typeof import('@demox-labs/miden-sdk/dist/index') = await import(
      '@demox-labs/miden-sdk'
    );
    setIsLoading(false);
    setMiden(sdk);
  }, [isLoading, Miden, setIsLoading, setMiden]);

  const createClient = useCallback(async () => {
    if (!Miden || client !== null) return;
    const newClient = await Miden.WebClient.create_client(
      'http://localhost:57291'
    );
    setClient(newClient);
  }, [Miden, setClient, client]);

  const createFaucet = useCallback(async () => {
    if (!Miden || !client || faucetId) return;
    const faucet = await client.new_faucet(
      Miden.AccountStorageMode.public(),
      false,
      'TEST',
      10,
      BigInt(1000000)
    );
    await client.sync_state();
    setFaucetId(faucet.id());
  }, [Miden, client, setFaucetId, faucetId]);

  useEffect(() => {
    loadSdk();
    createClient();
  }, [loadSdk, createClient]);

  return (
    <MidenSdkContext.Provider
      value={{ isLoading, Miden, client, faucetId, createFaucet }}
    >
      {children}
    </MidenSdkContext.Provider>
  );
};
