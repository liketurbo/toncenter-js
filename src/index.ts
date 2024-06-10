import { ApiKeyType, Network } from "./interfaces";
import ClientApiV2 from "./v2/api";

(async () => {
  try {
    const apiKey =
      "a8b61ced4be11488cb6e82d65b93e3d4a29d20af406aed9688b9e0077e2dc742";
    const address = "0QCbOix87iy37AwRCWaYhJHzc2gXE_WnAG5vVEAySNT7zClz";

    const api = new ClientApiV2(Network.Testnet, {
      key: apiKey,
      type: ApiKeyType.Header,
    });

    const account = await api.getAddressInformation(address);
    console.log("Account:", account);
  } catch (error) {
    console.error(error);
  }
})();
