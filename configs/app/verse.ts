import { getEnvValue, getExternalAssetFilePath, parseEnvJson } from './utils';

// Define token interface
interface Token {
  address: string;
  name: string;
  symbol: string;
}

// Token list interface
interface TokenList {
  tokens: Array<Token>;
}

// Default token list
const defaultTokens: TokenList = {
  tokens: [
    {
      address: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
      name: 'Oasys',
      symbol: 'OAS',
    },
  ],
};

class TokenListManager {
  private tokenList: TokenList;

  constructor() {
    this.tokenList = defaultTokens;
  }

  public async fetchTokenList() {
    try {
      // Get path to external asset file
      const tokenFilePath = getExternalAssetFilePath('NEXT_PUBLIC_UPDATED_TOKENS');

      // If no external file path is configured, use default tokens
      if (!tokenFilePath) {
        return;
      }

      // Fetch the JSON file from the public directory
      const response = await fetch(tokenFilePath);
      if (!response.ok) {
        console.log(`Failed to fetch external token list (${ response.status }), using default token list`);
        return;
      }

      const data = await response.json();

      // Validate the data structure
      if (this.isValidTokenList(data)) {
        this.tokenList = data;
        console.log('Token list loaded successfully from external source');
      } else {
        console.error('Invalid token list format from external source');
        console.log('Using default token list as fallback');
      }
    } catch (error) {
      console.error('Error loading token list from external source:', error);
      console.log('Using default token list as fallback');
    }
  }

  private isValidTokenList(data: unknown): data is TokenList {
    return (
      typeof data === 'object' &&
      data !== null &&
      'tokens' in data &&
      Array.isArray((data as TokenList).tokens) &&
      (data as TokenList).tokens.every(token =>
        typeof token === 'object' &&
        token !== null &&
        'address' in token &&
        'name' in token &&
        'symbol' in token,
      )
    );
  }

  public findTokenByAddress(address: string): Token | undefined {
    if (!address) return undefined;

    const lowerCaseAddress = address.toLowerCase();
    return this.tokenList.tokens.find(token =>
      token.address.toLowerCase() === lowerCaseAddress,
    );
  }

  public get all(): Array<Token> {
    return this.tokenList.tokens;
  }
}

// Bridge token interface with TokenIndex mapping
interface BridgeToken extends Token {
  tokenIndex?: string;
}

interface BridgeTokenList {
  tokens: Array<BridgeToken>;
}

class BridgeTokenListManager {
  private tokenList: BridgeTokenList;
  private _erc20Addresses: { [key: string]: string } = {};

  constructor() {
    this.tokenList = { tokens: [] };
  }

  public async fetchTokenList() {
    try {
      // Get the environment variable value
      const envValue = getEnvValue('NEXT_PUBLIC_ERC20_BRIDGE_TOKENS');

      if (!envValue) {
        console.log('No bridge token configuration found, using default');
        return;
      }

      let data;

      // Check if it's a URL
      if (envValue.startsWith('http://') || envValue.startsWith('https://')) {
        // It's a URL, fetch from URL
        console.log('Fetching bridge tokens from URL:', envValue);
        const response = await fetch(envValue);
        if (!response.ok) {
          console.log(`Failed to fetch external bridge token list (${ response.status }), using default token list`);
          return;
        }
        data = await response.json();
      } else {
        // It's JSON content, parse directly
        console.log('Parsing bridge tokens from JSON content');
        data = parseEnvJson(envValue);
        if (!data) {
          console.log('Failed to parse bridge token JSON content, using default token list');
          return;
        }
      }

      // Validate the data structure
      if (this.isValidBridgeTokenList(data)) {
        this.tokenList = data;
        // Build erc20Addresses mapping
        this.buildErc20Addresses();
        console.log('Bridge token list loaded successfully from external source');
      } else {
        console.error('Invalid bridge token list format from external source');
        console.log('Using default bridge token list as fallback');
      }
    } catch (error) {
      console.error('Error loading bridge token list from external source:', error);
      console.log('Using default bridge token list as fallback');
    }
  }

  private isValidBridgeTokenList(data: unknown): data is BridgeTokenList {
    return (
      typeof data === 'object' &&
      data !== null &&
      'tokens' in data &&
      Array.isArray((data as BridgeTokenList).tokens) &&
      (data as BridgeTokenList).tokens.every(token =>
        typeof token === 'object' &&
        token !== null &&
        'address' in token &&
        'name' in token &&
        'symbol' in token &&
        'tokenIndex' in token,
      )
    );
  }

  private buildErc20Addresses() {
    this._erc20Addresses = {};
    this.tokenList.tokens.forEach(token => {
      if (token.tokenIndex) {
        this._erc20Addresses[token.tokenIndex] = token.address;
      }
    });
  }

  public findTokenByAddress(address: string): BridgeToken | undefined {
    if (!address) return undefined;

    const lowerCaseAddress = address.toLowerCase();
    return this.tokenList.tokens.find(token =>
      token.address.toLowerCase() === lowerCaseAddress,
    );
  }

  public get all(): Array<BridgeToken> {
    return this.tokenList.tokens;
  }

  public get erc20Addresses(): { [key: string]: string } {
    return this._erc20Addresses;
  }

  public async ensureLoaded(): Promise<void> {
    if (this.tokenList.tokens.length === 0) {
      await this.fetchTokenList();
    }
  }
}

// Create a singleton instance
const tokenListManager = new TokenListManager();

const bridgeTokenListManager = new BridgeTokenListManager();

// Initialize token list in client environment
if (typeof window !== 'undefined') {
  // Load both token lists asynchronously
  Promise.all([
    tokenListManager.fetchTokenList(),
    bridgeTokenListManager.fetchTokenList(),
  ]).then(() => {
    console.log('Token lists loaded successfully');
  }).catch((error) => {
    console.error('Error loading token lists:', error);
  });
}

export const CHAIN_INFO: { [key: string]: { id: number; name: string } } = {
  '248': { id: 248, name: 'Oasys' },
  '9372': { id: 9372, name: 'OasysTestnet' },
  '2400': { id: 2400, name: 'TCGVerse' },
  '7225878': { id: 7225878, name: 'SaakuruVerse' },
  '29548': { id: 29548, name: 'MCHVerse' },
  '7300': { id: 7300, name: 'XPLAVerse' },
  '19011': { id: 19011, name: 'HOMEVerse' },
  '16116': { id: 16116, name: 'DefiVerse' },
  '50006': { id: 50006, name: 'YooldoVerse' },
  '75512': { id: 75512, name: 'GeekVerse' },
  '5555': { id: 5555, name: 'ChainVerse' },
  '428': { id: 428, name: 'GesoVerse' },
};

export const getChainName = () => {
  const networkId = getEnvValue('NEXT_PUBLIC_NETWORK_ID') || 2400;
  if (!networkId || !CHAIN_INFO[networkId]) {
    return 'Unknown Chain';
  }
  return CHAIN_INFO[networkId].name;
};

export default Object.freeze({
  opNode: {
    isHiddenTxs: getEnvValue('NEXT_PUBLIC_HOMEPAGE_HIDDEN_OP_NODE_TXS') === 'true',
  },
  tokens: {
    // Provide token array from JSON for accessing all tokens when needed
    get all() {
      return tokenListManager.all;
    },
    // Function to find token by address
    findByAddress: (address: string) => tokenListManager.findTokenByAddress(address),
  },
  bridgeTokens: {
    // Provide token array from JSON for accessing all tokens when needed
    get all() {
      return bridgeTokenListManager.all;
    },
    // Function to find token by address
    findByAddress: (address: string) => bridgeTokenListManager.findTokenByAddress(address),
    // Get ERC20 addresses mapping
    get erc20Addresses() {
      return bridgeTokenListManager.erc20Addresses;
    },
    // Ensure bridge token list is loaded
    ensureLoaded: () => bridgeTokenListManager.ensureLoaded(),
  },
  bridge: {
    isVisible: getEnvValue('NEXT_PUBLIC_MENU_BRIDGE_VISIBLE') === 'true',
    l1BridgeAddress: getEnvValue('NEXT_PUBLIC_L1_BRIDGE_ADDRESS') || '0x9245e19eB88de2534E03E764FB2a5f194e6d97AD',
    l2ChainId: getEnvValue('NEXT_PUBLIC_L2_CHAIN_ID') || 2400,
    l2ChainName: getChainName,
    verseVersion: getEnvValue('NEXT_PUBLIC_VERSE_VERSION'),
  },
  coinPrice: {
    isDisabled: getEnvValue('NEXT_PUBLIC_PRICE_TRACKER_DISABLE') === 'true',
  },
  experiment: {
    isVisible: getEnvValue('NEXT_PUBLIC_EXPERIMENT_VISIBLE') ? true : false,
    api: getEnvValue('NEXT_PUBLIC_EXPERIMENT_API_URL'),
  },
});
