import { ClientApi } from "../base/api";
import { ApiKeyConfig, Network } from "../interfaces";
import {
  BlocksMasterchainInfo,
  BlocksShardBlockProof,
  BlocksShards,
  BlocksTransactions,
  ConfigInfo,
  ConsensusBlock,
  DetectAddressResult,
  FullAccountState,
  MasterchainBlockSignatures,
  Ok,
  QueryFees,
  RawExtMessageInfo,
  RawFullAccountState,
  RawTransaction,
  SmcRunResult,
  TokenData,
  TonBlockIdExt,
  WalletInformation,
} from "./interfaces";

export default class ClientApiV2 extends ClientApi {
  constructor(network: Network, apiKeyConfig: ApiKeyConfig | null = null) {
    const baseURL =
      network === Network.Mainnet
        ? "https://toncenter.com/api/v2"
        : "https://testnet.toncenter.com/api/v2";

    super(baseURL, apiKeyConfig);
  }

  /**
   * Get basic information about the address: balance, code, data, last_transaction_id, etc.
   *
   * @param address - Identifier of the target TON account in any form.
   */
  async getAddressInformation(address: string) {
    const params = { address };

    return this.get<RawFullAccountState>("getAddressInformation", params);
  }

  /**
   * Get extended information about the address.
   *
   * Similar to the previous method but tries to parse additional information for known contract types.
   * This method is based on tonlib's function `getAccountState`.
   * For detecting wallets, we recommend using `getWalletInformation`.
   *
   * @param address - Identifier of the target TON account in any form.
   */
  async getExtendedAddressInformation(address: string) {
    const params = { address };
    return this.get<FullAccountState>("getExtendedAddressInformation", params);
  }

  /**
   * Retrieve wallet information.
   *
   * This method parses contract state and currently supports more wallet types than getExtendedAddressInformation:
   * simple wallet, standard wallet, v3 wallet, v4 wallet.
   *
   * @param address - Identifier of the target TON account in any form.
   */
  async getWalletInformation(address: string) {
    const params = { address };
    return this.get<WalletInformation>("getWalletInformation", params);
  }

  /**
   * Get transaction history of a given address.
   *
   * @param address - Identifier of the target TON account in any form.
   * @param limit - Maximum number of transactions in response (optional).
   * @param lt - Logical time of transaction to start with, must be sent with `hash` (optional).
   * @param hash - Hash of transaction to start with, in `base64` or `hex` encoding, must be sent with `lt` (optional).
   * @param toLt - Logical time of transaction to finish with (optional).
   * @param archival - If `true`, only liteservers with full history are used (optional).
   */
  async getTransactions(
    address: string,
    limit?: number,
    lt?: number,
    hash?: string,
    toLt?: number,
    archival?: boolean
  ) {
    const params: Record<string, string> = { address };

    if (limit !== undefined) {
      params.limit = limit.toString();
    }
    if (lt !== undefined) {
      params.lt = lt.toString();
    }
    if (hash !== undefined) {
      params.hash = hash;
    }
    if (toLt !== undefined) {
      params.to_lt = toLt.toString();
    }
    if (archival !== undefined) {
      params.archival = archival.toString();
    }

    return this.get<RawTransaction[]>("getTransactions", params);
  }

  /**
   * Get balance (in nanotons) of a given address.
   *
   * @param address - Identifier of the target TON account in any form.
   */
  async getAddressBalance(address: string) {
    const params = { address };
    return this.get<string>("getAddressBalance", params);
  }

  /**
   * Get state of a given address. State can be either uninitialized, active, or frozen.
   *
   * @param address - Identifier of the target TON account in any form.
   */
  async getAddressState(address: string) {
    const params = { address };
    return this.get<string>("getAddressState", params);
  }

  /**
   * Packs a raw address into a human-readable format.
   *
   * @param address - Identifier of the target TON account in raw form.
   */
  async packAddress(address: string) {
    const params = { address };
    return this.get<string>("packAddress", params);
  }

  /**
   * Unpacks a human-readable address into its raw format.
   *
   * @param address - Identifier of the target TON account in user-friendly form.
   */
  async unpackAddress(address: string) {
    const params = { address };
    return this.get<string>("unpackAddress", params);
  }

  /**
   * Get NFT or Jetton information.
   *
   * @param address - Address of NFT collection/item or Jetton master/wallet smart contract.
   */
  async getTokenData(address: string) {
    const params = { address };
    return this.get<TokenData>("getTokenData", params);
  }

  /**
   * Detect address in all possible forms.
   *
   * @param address - Identifier of the target TON account in any form.
   */
  async detectAddress(address: string) {
    const params = { address };
    return this.get<DetectAddressResult>("detectAddress", params);
  }

  /**
   * Get up-to-date masterchain state.
   */
  async getMasterchainInfo() {
    return this.get<BlocksMasterchainInfo>("getMasterchainInfo", {});
  }

  /**
   * Get masterchain block signatures by sequence number.
   *
   * @param seqno - Sequence number of the masterchain block.
   */
  async getMasterchainBlockSignatures(seqno: number) {
    const params = { seqno: seqno.toString() };
    return this.get<MasterchainBlockSignatures>(
      "getMasterchainBlockSignatures",
      params
    );
  }

  /**
   * Get shard block proof.
   *
   * @param workchain - Block workchain id.
   * @param shard - Block shard id.
   * @param seqno - Block seqno.
   * @param fromSeqno - Seqno of masterchain block starting from which proof is required. Optional.
   */
  async getShardBlockProof(
    workchain: number,
    shard: string,
    seqno: number,
    fromSeqno?: number
  ) {
    const params: Record<string, string> = {
      workchain: workchain.toString(),
      shard,
      seqno: seqno.toString(),
    };

    if (fromSeqno !== undefined) {
      params.from_seqno = fromSeqno.toString();
    }

    return this.get<BlocksShardBlockProof>("getShardBlockProof", params);
  }

  /**
   * Get consensus block and its update timestamp.
   *
   * @returns A promise that resolves to the consensus block information.
   */
  async getConsensusBlock() {
    return this.get<ConsensusBlock>("getConsensusBlock", {});
  }

  /**
   * Look up block by either seqno, lt or unixtime.
   *
   * @param workchain - Workchain id to look up block in.
   * @param shard - Shard id to look up block in.
   * @param seqno - Block's height (optional).
   * @param lt - Block's logical time (optional).
   * @param unixtime - Block's unixtime (optional).
   */
  async lookupBlock(
    workchain: number,
    shard: string,
    seqno?: number,
    lt?: number,
    unixtime?: number
  ) {
    const params: Record<string, string> = {
      workchain: workchain.toString(),
      shard: shard.toString(),
    };

    if (seqno !== undefined) {
      params.seqno = seqno.toString();
    }
    if (lt !== undefined) {
      params.lt = lt.toString();
    }
    if (unixtime !== undefined) {
      params.unixtime = unixtime.toString();
    }

    return this.get<TonBlockIdExt>("lookupBlock", params);
  }

  /**
   * Get shards information.
   *
   * @param seqno - Masterchain seqno to fetch shards of.
   */
  async getShards(seqno: number) {
    const params = { seqno: seqno.toString() };
    return this.get<BlocksShards>("shards", params);
  }

  /**
   * Get transactions of the given block.
   *
   * @param workchain - Workchain id to look up block in.
   * @param shard - Shard id to look up block in.
   * @param seqno - Block's height.
   * @param rootHash - Block's root hash (optional).
   * @param fileHash - Block's file hash (optional).
   * @param afterLt - Logical time of transaction after which to start (optional).
   * @param afterHash - Hash of transaction after which to start (optional).
   * @param count - Maximum number of transactions to return (optional, default is 40).
   */
  async getBlockTransactions(
    workchain: number,
    shard: string,
    seqno: number,
    rootHash?: string,
    fileHash?: string,
    afterLt?: number,
    afterHash?: string,
    count?: number
  ) {
    const params: Record<string, string> = {
      workchain: workchain.toString(),
      shard: shard,
      seqno: seqno.toString(),
    };

    if (rootHash !== undefined) {
      params.root_hash = rootHash;
    }
    if (fileHash !== undefined) {
      params.file_hash = fileHash;
    }
    if (afterLt !== undefined) {
      params.after_lt = afterLt.toString();
    }
    if (afterHash !== undefined) {
      params.after_hash = afterHash;
    }
    if (count !== undefined) {
      params.count = count.toString();
    }

    return this.get<BlocksTransactions>("getBlockTransactions", params);
  }

  /**
   * Locate outgoing transaction of destination address by incoming message.
   *
   * @param source - Source address.
   * @param destination - Destination address.
   * @param createdLt - Created logical time.
   */
  async tryLocateTx(source: string, destination: string, createdLt: number) {
    const params = {
      source,
      destination,
      created_lt: createdLt.toString(),
    };

    return this.get<RawTransaction>("tryLocateTx", params);
  }

  /**
   * Same as previous. Locate outgoing transaction of destination address by incoming message.
   *
   * @param source - Source address.
   * @param destination - Destination address.
   * @param createdLt - Created logical time.
   */
  async tryLocateResultTx(
    source: string,
    destination: string,
    createdLt: number
  ) {
    const params = {
      source,
      destination,
      created_lt: createdLt.toString(),
    };

    return this.get<RawTransaction>("tryLocateResultTx", params);
  }

  /**
   * Locate incoming transaction of source address by outgoing message.
   *
   * @param source - Source address.
   * @param destination - Destination address.
   * @param createdLt - Created logical time.
   */
  async tryLocateSourceTx(
    source: string,
    destination: string,
    createdLt: number
  ) {
    const params = {
      source,
      destination,
      created_lt: createdLt.toString(),
    };

    return this.get<RawTransaction>("tryLocateSourceTx", params);
  }

  /**
   * Get config parameter by id.
   *
   * @param configId - Configuration id.
   * @param seqno - Masterchain seqno (optional). If not specified, latest blockchain state will be used.
   */
  async getConfigParam(configId: number, seqno?: number) {
    const params: Record<string, string> = {
      config_id: configId.toString(),
    };

    if (seqno !== undefined) {
      params.seqno = seqno.toString();
    }

    return this.get<ConfigInfo>("getConfigParam", params);
  }

  /**
   * Run get method on smart contract.
   *
   * @param address - Address of the smart contract.
   * @param method - Method name to run.
   * @param stack - Parameters for the method.
   */
  async runGetMethod(address: string, method: string, stack: string[]) {
    const requestBody = {
      address,
      method,
      stack,
    };

    return this.postApi<SmcRunResult>("runGetMethod", requestBody);
  }

  /**
   * Send serialized BOC file: fully packed and serialized external message to blockchain.
   *
   * @param boc - Serialized BOC file (b64-encoded).
   */
  async sendBoc(boc: string) {
    const body = { boc };

    return this.postApi<Ok>("sendBoc", body);
  }

  /**
   * Send serialized BOC file: fully packed and serialized external message to blockchain.
   * The method returns message hash.
   *
   * @param boc - Serialized BOC file (b64-encoded).
   */
  async sendBocReturnHash(boc: string) {
    const body = { boc };

    return this.postApi<RawExtMessageInfo>("sendBocReturnHash", body);
  }

  /**
   * This method takes address, body and init-params (if any), packs it to external message and sends to network.
   * All params should be BOC-serialized.
   *
   * @param address - The target address.
   * @param body - Optional BOC-serialized body (b64-encoded).
   * @param initCode - Optional BOC-serialized init code (b64-encoded).
   * @param initData - Optional BOC-serialized init data (b64-encoded).
   */
  async sendQuery(
    address: string,
    body?: string,
    initCode?: string,
    initData?: string
  ) {
    const requestBody: Record<string, any> = { address };

    if (body) {
      requestBody.body = body;
    }
    if (initCode) {
      requestBody.init_code = initCode;
    }
    if (initData) {
      requestBody.init_data = initData;
    }

    return this.postApi<Ok>("sendQuery", requestBody);
  }

  /**
   * Estimate fees required for query processing.
   * `body`, `initCode`, and `initData` accepted in serialized format (b64-encoded).
   *
   * @param address - The target address.
   * @param body - Optional BOC-serialized body (b64-encoded).
   * @param initCode - Optional BOC-serialized init code (b64-encoded).
   * @param initData - Optional BOC-serialized init data (b64-encoded).
   * @param ignoreChksig - Optional flag to ignore check signature.
   */
  async estimateFee(
    address: string,
    body?: string,
    initCode?: string,
    initData?: string,
    ignoreChksig?: boolean
  ) {
    const requestBody: Record<string, any> = { address };

    if (body) {
      requestBody.body = body;
    }
    if (initCode) {
      requestBody.init_code = initCode;
    }
    if (initData) {
      requestBody.init_data = initData;
    }
    if (ignoreChksig !== undefined) {
      requestBody.ignore_chksig = ignoreChksig;
    }

    return this.postApi<QueryFees>("estimateFee", requestBody);
  }

    /**
     * Generic JSON-RPC method to interact with Toncenter API.
     *
     * @param method - The JSON-RPC method name.
     * @param params - Parameters for the JSON-RPC method.
     * @param id - The JSON-RPC request ID.
     */
    async jsonRpc<T = any>(method: string, params: Record<string, any>, id: number) {
        const requestBody = {
            jsonrpc: "2.0",
            method: method,
            params: params,
            id: id,
        };

        return this.postRpc<T>('jsonRPC', requestBody);
    }
}
