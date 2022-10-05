import { PublicKey } from '@solana/web3.js';
import { TokenType } from './TokenType';

export function getMintPublicKey(token: TokenType): PublicKey | null {
  switch (token) {
    case TokenType.USDC:
      return new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

    case TokenType.ETH:
      return new PublicKey('7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs');

    case TokenType.BTC:
      return new PublicKey('9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E');

    case TokenType.SOL:
      return new PublicKey('So11111111111111111111111111111111111111112');

    case TokenType.SLND:
      return new PublicKey('SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp');

    case TokenType.MNGO:
      return new PublicKey('MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac');

    case TokenType.USDH:
      return new PublicKey('USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX');

    case TokenType.UXD:
      return new PublicKey('7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT');

    default:
      return null;
  }
}
