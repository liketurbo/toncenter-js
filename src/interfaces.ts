export enum ApiKeyType {
    Header = 'header',
    Query = 'query'
}

export interface ApiKeyConfig {
    type: ApiKeyType;
    key: string;
}

export enum Network {
    Mainnet = 'mainnet',
    Testnet = 'testnet'
}