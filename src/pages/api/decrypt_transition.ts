import type { NextApiRequest, NextApiResponse } from 'next';

import '@/lib/fetch';
import { DecryptTransition } from '@demox-labs/aleo-sdk';

type ErrorData = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'GET') {
    return res.status(400).json({ error: 'Invalid method.' });
  }
  const { transitionViewKey, aleoTransition } = req.query;

  // Add validation for transitionViewKey and aleoTransition
  if (!transitionViewKey || !aleoTransition) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  const decryptedTransition = DecryptTransition.decrypt_transition_with_tvk(
    'MainnetV0',
    transitionViewKey as string,
    aleoTransition as string
  );

  res.status(200).json({ decryptedTransition });
}
