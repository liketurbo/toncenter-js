import { ClientApi } from "../base/api";
import { ApiKeyConfig, Network } from "../interfaces";
import { RawFullAccountState } from "./interfaces";

export default class ClientApiV2 extends ClientApi {
  constructor(network: Network, apiKeyConfig: ApiKeyConfig | null = null) {
    const baseURL =
      network === Network.Mainnet
        ? "https://toncenter.com/api/v2"
        : "https://testnet.toncenter.com/api/v2";

    super(baseURL, apiKeyConfig);
  }

  async getAddressInformation(address: string): Promise<RawFullAccountState> {
    const params = { address };

    return await this.sendRequest<RawFullAccountState>(
      "GET",
      "getAddressInformation",
      params
    );
  }
}
