import Dexie from 'dexie';

var db = new Dexie('AleoParameters');
var PARAMETERS_TABLE = 'parameters';
db.version(1).stores({
  [PARAMETERS_TABLE]: 'name',
});

const FILES = [
  {
    name: 'TransferProver',
    url: 'https://aleo-public.s3.us-west-2.amazonaws.com/testnet3/transfer.prover.837ad21',
  },
  {
    name: 'TransferVerifier',
    url: 'https://aleo-public.s3.us-west-2.amazonaws.com/testnet3/transfer.verifier.db46e4c',
  },
  {
    name: 'BakeCookieProver',
    url: 'https://aleo-public.s3.us-west-2.amazonaws.com/testnet3/bake_cookie.prover',
  },
  {
    name: 'BakeCookieVerifier',
    url: 'https://aleo-public.s3.us-west-2.amazonaws.com/testnet3/bake_cookie.verifier',
  },
  {
    name: 'EatCookieProver',
    url: 'https://aleo-public.s3.us-west-2.amazonaws.com/testnet3/eat_cookie.prover',
  },
  {
    name: 'EatCookieVerifier',
    url: 'https://aleo-public.s3.us-west-2.amazonaws.com/testnet3/eat_cookie.verifier',
  },
];

export async function getAllSavedFiles() {
  return await db.table(PARAMETERS_TABLE).toArray();
}

export async function getSavedFile(name: string) {
  let files = await db
    .table(PARAMETERS_TABLE)
    .filter((file: any) => file.name == name)
    .toArray();
  if (files.length == 0) {
    throw new Error(`${name} file not found in IndexedDB`);
  }
  return files[0];
}

async function downloadFile(url: string) {
  let response = await fetch(url);
  const reader = response!.body!.getReader();
  const contentLength = +response!.headers!.get('Content-Length')!;

  let receivedLength = 0; // received that many bytes at the moment
  let chunks = []; // array of received binary chunks (comprises the body)
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
    receivedLength += value.length;

    if (chunks.length % 50 == 0) {
      console.log(`Received ${receivedLength} of ${contentLength}`);
    }
  }

  // Step 4: concatenate chunks into single Uint8Array
  let chunksAll = new Uint8Array(receivedLength); // (4.1)
  let position = 0;
  for (let chunk of chunks) {
    chunksAll.set(chunk, position);
    position += chunk.length;
  }
  return chunksAll;
}

export async function downloadAndStoreFiles() {
  const existingFiles = await getAllSavedFiles();
  const fileNames = existingFiles.map((file: any) => file.name);
  const existingFileNames = new Set(fileNames);

  for (let i = 0; i < FILES.length; i++) {
    const { name, url } = FILES[i];
    console.log(`Fetching ${name} parameter file`);

    if (existingFileNames.has(name)) {
      console.log(`${name} already saved...`);
      continue;
    }

    const bytes = await downloadFile(url);
    await db.parameters.put({
      name: name,
      bytes: bytes,
    });
  }
}
