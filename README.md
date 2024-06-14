# toncenter-js

[![Latest version](https://img.shields.io/npm/v/toncenter.svg)](https://www.npmjs.com/package/toncenter)

SDK for integrating Toncenter into JavaScript applications. Connect and interact with the Toncenter API effortlessly.

## Features

- **Authorization Support**: You can obtain a token from [@tonapibot](https://t.me/tonapibot).
- **REST API v2 Integration**: Interact with Toncenter RESTful endpoints for API v2.
- **REST API v3 Integration**: Interact with Toncenter RESTful endpoints for API v3 (in progress).
- **JSON-RPC API Integration**: Utilize JSON-RPC protocol for all available methods.

## Installation

```bash
# Using npm
npm install toncenter

# Using yarn
yarn add toncenter
```

## Usage

```javascript
import { ClientApiV2, Network, ApiKeyType } from "toncenter";

async function main() {
  const apiKey =
    "a8b61ced4be11488cb6e82d65b93e3d4a29d20af406aed9688b9e0077e2dc742";
  const address = "0QCbOix87iy37AwRCWaYhJHzc2gXE_WnAG5vVEAySNT7zClz";

  const apiClient = new ClientApiV2(Network.Testnet, {
    key: apiKey,
    type: ApiKeyType.Header,
  });

  try {
    const info = await apiClient.getAddressInformation(address);
    console.log("Address info:", info);
  } catch (e) {
    console.error(e);
  }

  const params = {
    address: address,
  };

  try {
    const response = await apiClient.jsonRpc(
      "getAddressInformation",
      params,
      1
    );
    console.log("Response:", response);
  } catch (e) {
    console.error(e);
  }
}

main().catch(console.error);
```

## Contributing

Contributions to this library are welcomed! If you'd like to contribute, please feel free to open a pull request on GitHub.

## License

This project is licensed under the MIT License.

## Acknowledgments

Special thanks to the Toncenter team for providing a robust API to interact with the TON blockchain.
