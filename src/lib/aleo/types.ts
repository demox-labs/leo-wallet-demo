type AleoInputType = {
  type: 'record' | 'private' | 'public' | 'external_record';
  id: string;
  value: string;
  tag?: string;
};

type AleoOutputType = {
  type: 'record' | 'private' | 'public' | 'external_record' | 'future';
  id: string;
  checksum?: string;
  value: string;
};

export type AleoTransition = {
  id: string;
  program: string;
  function: string;
  inputs: AleoInputType[];
  outputs: AleoOutputType[];
  tpk: string;
  tcm: string;
};

export type AleoTransactionResponseStatus = 'accepted' | 'rejected';

export type AleoTransactionResponse = {
  index: number;
  status: AleoTransactionResponseStatus;
  type: AleoTransactionType;
  transaction: AleoTransaction;
  finalizedAt: number;
};

type AleoTransactionType = 'deploy' | 'execute' | 'fee';

type BaseTransaction = {
  type: AleoTransactionType;
  id: string;
  fee: {
    transition: AleoTransition;
    global_state_root: string;
    proof: string;
  };
};

export type DeployTransaction = BaseTransaction & {
  type: 'deploy';
  deployment: {
    edition: number;
    program: string;
  };
};

export type Execution = {
  transitions: AleoTransition[];
  global_state_root: string;
  inclusion: string;
};

export type ExecuteTransaction = BaseTransaction & {
  type: 'execute';
  execution: Execution;
};

export type FeeTransaction = BaseTransaction & {
  type: 'fee';
  rejected: {
    transitions: AleoTransition[];
    global_state_root: string;
  };
};

export type AleoTransaction =
  | DeployTransaction
  | ExecuteTransaction
  | FeeTransaction;
