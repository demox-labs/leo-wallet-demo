// get v3 Mango Group
import {
  IDS,
  MangoClient,
  Config,
  I80F48,
} from '@blockworks-foundation/mango-client';
import { Connection, PublicKey } from '@solana/web3.js';
import { coinList } from '@/data/static/coin-list';

export async function getPrices() {
  const cluster = 'mainnet';
  const group = 'mainnet.1';

  const config = new Config(IDS);
  const groupConfig = config.getGroup(cluster, group);
  if (!groupConfig) {
    throw new Error('unable to get mango group config');
  }
  const mangoGroupKey = groupConfig.publicKey;

  const clusterData = IDS.groups.find((g) => {
    return g.name == group && g.cluster == cluster;
  });
  const mangoProgramIdPk = new PublicKey(clusterData?.mangoProgramId!);

  const clusterUrl = IDS.cluster_urls[cluster];
  const connection = new Connection(clusterUrl, 'singleGossip');
  const client = new MangoClient(connection, mangoProgramIdPk);
  const mangoGroup = await client.getMangoGroup(mangoGroupKey);

  const cache = await mangoGroup.loadCache(connection);
  let prices = new Map<string, number>();
  for (let i = 0; i < coinList.length; i++) {
    const mint = coinList[i].mint;
    const tokenIdx = mangoGroup.getTokenIndex(mint);
    const price = mangoGroup.getPrice(tokenIdx, cache);
    prices.set(coinList[i].code, price.toNumber());
  }
  return prices;
}
