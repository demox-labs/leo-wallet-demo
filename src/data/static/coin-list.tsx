import { Solana } from '@/components/icons/solana';
import { Usdc } from '@/components/icons/usdc';
import { Mango } from '@/components/icons/mango';
import { Bitcoin } from '@/components/icons/bitcoin';
import { Ethereum } from '@/components/icons/ethereum';
import { Tether } from '@/components/icons/tether';
import { Serum } from '@/components/icons/serum';
import { Raydium } from '@/components/icons/raydium';
import { PublicKey } from '@solana/web3.js';

export const coinList = [
  {
    icon: <Solana />,
    code: 'SOL',
    name: 'Solana',
    price: 33.5,
    mint: new PublicKey('So11111111111111111111111111111111111111112'),
  },
  {
    icon: <Usdc />,
    code: 'USDC',
    name: 'USD Coin',
    price: 1.001,
    mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
  },
  {
    icon: <Mango />,
    code: 'MNGO',
    name: 'Mango',
    price: 0.04,
    mint: new PublicKey('MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac'),
  },
  {
    icon: <Bitcoin />,
    code: 'BTC',
    name: 'Bitcoin',
    price: 19076.29,
    mint: new PublicKey('9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E'),
  },
  {
    icon: <Ethereum />,
    code: 'ETH',
    name: 'Ethereum',
    price: 1053.28,
    mint: new PublicKey('2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk'),
  },
  {
    icon: <Tether />,
    code: 'USDT',
    name: 'Tether USD',
    price: 0.999,
    mint: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
  },
  {
    icon: <Serum />,
    code: 'SRM',
    name: 'Serum',
    price: 0.999,
    mint: new PublicKey('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt'),
  },
  {
    icon: <Raydium />,
    code: 'RAY',
    name: 'Raydium',
    price: 0.999,
    mint: new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'),
  },
];
