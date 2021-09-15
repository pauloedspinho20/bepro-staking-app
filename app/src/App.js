import React from "react";

import {
  Application, DexStorage, ERC20Contract, StakingContract,
  ERC20TokenLock, ERC721Collectibles, ERC721Standard
} from 'bepro-js';

import Web3 from "web3";
// import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      provider: null,
      isWeb3Detected: false,
      isConnected: false,
      walletAddress: null,
      appNetwork: 'Kovan',
      network: null,
      stakingContractAvailableTokens: null,
      stackingContractAddress: ''
    };
  }

  isWeb3Detected() {
    if (typeof window.ethereum !== 'undefined') {
      this.setState({
        isWeb3Detected: true
      });
      return true
    }
    this.setState({
      isWeb3Detected: false
    });
    return false
  }

  connectMetamask = async () => {
    console.log("Log in Metamask")
    if (this.isWeb3Detected()) { // Check if Web3 Wallet (Metamask) is installed

      let app = new Application({ opt: { web3Connection: 'WEB3_LINK' } }); // Bepro Web3 implementation

      if (app) {
        await app.login();
        this.setState({
          isConnected: true,
          address: await app.getAddress(),
          network: await app.getETHNetwork()
        });
        localStorage.setItem('walletConnected', 'true');
      } else {
        localStorage.setItem('walletConnected', 'false');
      }
    }
  }

  // connect wallet via bepro-js
  connectWalletConnect = async () => {
    if (!this.state.isConnected) {
      console.log("Log in with connect wallet")

      // Create WalletConnect Provider
      const provider = new WalletConnectProvider({
        rpc: {
          56: "https://bsc-dataseed.binance.org/",
        },
        chainId: 56
      });
      provider.networkId = 56;

      //  Enable session (triggers QR Code modal)
      await provider.enable();

      const web3 = new Web3(provider);

      if (provider) {
        window.web3 = web3 // Set browser web3 as web3Modal provider
        let app = new Application({ opt: { web3Connection: 'WEB3_LINK' } }); // Bepro Web3 implementation

        if (app) {
          app.web3 = web3 // Set bepro-js web as  web3Modal provider

          this.setState({
            isConnected: true,
            walletAddress: await app.getAddress(),
            network: await app.getETHNetwork()
          });
          localStorage.setItem('walletConnected', 'true');
        } else {
          localStorage.setItem('walletConnected', 'false');
        }
      }
    }
  }

  disconnectWallet = async () => {

    const provider = this.state.provider
    console.log("Killing the wallet connection", provider);

    // TODO: Which providers have close method?
    if (provider.close) {
      await provider.close();

      // If the cached provider is not cleared,
      // WalletConnect will default to the existing session
      // and does not allow to re-scan the QR code with a new wallet.
      // Depending on your use case you may want or want not his behavir.
      await this.openWeb3Modal.clearCachedProvider();

      this.setState({
        provider: null,
        walletAddress: null,
        network: null
      });
    }

    // selectedAccount = null;
  }

  // Initialize staking contract via bepro-js
  initStakingContract = async () => {
    let staking = new StakingContract({
      tokenAddress: '0x851f72005b5930625202afb45dbde6f48a2618f6',
      contractAddress: '0xB3C1d743C83e671DF677165c30Ef7b3F38276756', /* Contract Address (optional) */
      opt: { web3Connection: 'WEB3_LINK' }
    })

    await staking.login();
    await staking.__assert();
    this.setState({
      stakingContractAvailableTokens: await staking.availableTokens(),
      stackingContractAddress: await staking.erc20()
    });

  }

  // Detect Metamask account change
  onNetworkChange() {
    window.addEventListener("load", function () {
      if (window.ethereum) {
        // Reload browser on Web3 Network change
        window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
      }
    });
  }

  componentDidMount() {
    if (localStorage.getItem('walletConnected') === 'true') {
      // this.connectWallet()
      this.onNetworkChange()
      // this.initStakingContract()
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Stacking App</h1>
        {this.state.isConnected ?
          <div>
            <p>Wallet address: <small>{this.state.walletAddress}</small></p>
            <p>Network: <small>{this.state.network}</small></p>
          </div> :
          ""
        }

        <button onClick={this.connectMetamask}>
          {!this.state.isConnected ? "Connect Metamask" : "Connected"}
        </button>

        <button onClick={this.connectWalletConnect}>
          {!this.state.isConnected ? "WalletConnect" : "Connected"}
        </button>

        {this.state.isConnected ?
          <button onClick={this.disconnectWallet}>Disconnect wallet</button>
          : null
        }

        <p> {((this.state.network !== this.state.appNetwork && this.state.isWeb3Detected && this.state.isConnected) ? 'Please connect to Kovan Network' : '')}</p>
        {/* <p> {((!this.state.isWeb3Detected) ? 'Please install Metamask' : '')}</p> */}
        {/* 
        <button onClick={this.stakingContract}>
          Staking
        </button>

        <p> {this.state.stakingContractAvailableTokens ? 'Available Tokens: ' + this.state.stakingContractAvailableTokens : ''} </p>
        <p> {this.state.stackingContractAddress ? 'Contract address: ' + this.state.stackingContractAddress : ''} </p> */}
      </div>
    );
  }
}

export default App;
