export interface RawFullAccountState {
    balance: string;
    code?: string;
    data?: string;
    lastTransactionId: InternalTransactionId;
    blockId: TonBlockIdExt;
    frozenHash?: string;
    syncUtime: number;
    extra: string;
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
    extra?: string;
}

