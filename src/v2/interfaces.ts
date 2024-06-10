export interface RawFullAccountState {
  balance: string;
  code?: string;
  data?: string;
  lastTransactionId: InternalTransactionId;
  blockId: TonBlockIdExt;
  frozenHash?: string;
  syncUtime: number;
  state: string;
}

export interface InternalTransactionId {
  lt: string;
  hash: string;
}

export interface TonBlockIdExt {
  workchain: number;
  shard: string;
  seqno: number;
  rootHash: string;
  fileHash: string;
}

export interface FullAccountState {
  address: AccountAddress;
  balance: string;
  lastTransactionId: InternalTransactionId;
  blockId: TonBlockIdExt;
  syncUtime: number;
  accountState: AccountState;
  revision: number;
}

export interface AccountAddress {
  accountAddress: string;
}

export type AccountState = UninitedAccountState | WalletV4AccountState;

export interface UninitedAccountState {
  frozenHash: string;
}

export interface WalletV4AccountState {
  walletId: string;
  seqno: number;
}

export interface WalletInformation {
  wallet: boolean;
  balance: string;
  accountState: string;
  walletType: string;
  seqno: number;
  lastTransactionId: InternalTransactionId;
  walletId: number;
}

export interface RawTransaction {
  address: AccountAddress;
  utime: number;
  data: string;
  transactionId: InternalTransactionId;
  fee: string;
  storageFee: string;
  otherFee: string;
  inMsg?: RawMessage;
  outMsgs: RawMessage[];
}

export interface RawMessage {
  source?: string;
  destination: string;
  value: string;
  fwdFee: string;
  ihrFee: string;
  createdLt: string;
  bodyHash: string;
  msgData: MsgDataRaw;
  message?: string;
}

export interface MsgDataRaw {
  body?: string;
  initState?: string;
  text?: string;
}

export interface TokenData {
  init: boolean;
  index: number;
  ownerAddress: string;
  collectionAddress: string;
  content: {
    type: string;
    data: string;
  };
  contractType: string;
}

export interface DetectAddressResult {
  rawForm: string;
  bounceable: {
    b64: string;
    b64url: string;
  };
  nonBounceable: {
    b64: string;
    b64url: string;
  };
  givenType: string;
  testOnly: boolean;
}

export interface BlocksMasterchainInfo {
  last: TonBlockIdExt;
  stateRootHash: string;
  init: TonBlockIdExt;
}

export interface MasterchainBlockSignatures {
  typeField: string;
  id: TonBlockIdExt;
  signatures: BlocksSignature[];
}

export interface BlocksSignature {
  nodeIdShort: string;
  signature: string;
}

export interface BlocksShardBlockProof {
  from: TonBlockIdExt;
  mcId: TonBlockIdExt;
  links: BlocksShardBlockLink[];
  mcProof: BlocksBlockLinkBack[];
}

export interface BlocksShardBlockLink {
  id: TonBlockIdExt;
  proof: string;
}

export interface BlocksBlockLinkBack {
  toKeyBlock: boolean;
  from: TonBlockIdExt;
  to: TonBlockIdExt;
  destProof: string;
  proof: string;
  stateProof: string;
}

export interface ConsensusBlock {
  consensusBlock: number;
  timestamp: number;
}

export interface BlocksShards {
  shards: TonBlockIdExt[];
}

export interface BlocksTransactions {
  id: TonBlockIdExt;
  reqCount: number;
  incomplete: boolean;
  transactions: BlocksShortTxId[];
}

export interface BlocksShortTxId {
  mode: number;
  account: string;
  lt: string;
  hash: string;
}

export interface BlocksHeader {
  id: TonBlockIdExt;
  globalId: number;
  version: number;
  flags: number;
  afterMerge: boolean;
  afterSplit: boolean;
  beforeSplit: boolean;
  wantMerge: boolean;
  wantSplit: boolean;
  validatorListHashShort: number;
  catchainSeqno: number;
  minRefMcSeqno: number;
  isKeyBlock: boolean;
  prevKeyBlockSeqno: number;
  startLt: string;
  endLt: string;
  genUtime: number;
  prevBlocks: TonBlockIdExt[];
}

export interface ConfigInfo {
  config: TvmCell;
}

export interface TvmCell {
  bytes: string;
}

export interface SmcRunResult {
  gasUsed: number;
  stack: [string, string][];
  exitCode: number;
}

export interface Ok {}

export interface RawExtMessageInfo {
  hash: string;
}
export interface QueryFees {
  sourceFees: Fees;
  destinationFees: Fees[];
}

export interface Fees {
  inFwdFee: number;
  storageFee: number;
  gasFee: number;
  fwdFee: number;
}
