import React from "react";
import moment from 'moment';
import {
  Application, DexStorage, ERC20Contract, StakingContract,
  ERC20TokenLock, ERC721Collectibles, ERC721Standard
} from 'bepro-js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWeb3Detected: false,
      isConnected: false,
      address: "",
      appNetwork: 'Kovan',
      network: "",
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

  // connect wallet via bepro-js
  connectWallet = async () => {
    if (!this.state.isConnected) {

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
      this.connectWallet()
      this.onNetworkChange()
      this.initStakingContract()
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Stacking App</h1>
        {this.state.isConnected ?
          <div>
            <p>Wallet address: <small>{this.state.address}</small></p>
            <p>Network: <small>{this.state.network}</small></p>
          </div> :
          ""
        }

        <button onClick={this.connectWallet}>
          {!this.state.isConnected ? "Connect to Metamask" : "Connected"}
        </button>
        <p> {((this.state.network !== this.state.appNetwork && this.state.isWeb3Detected && this.state.isConnected) ? 'Please connect to Kovan Network' : '')}</p>
        <p> {((!this.state.isWeb3Detected) ? 'Please install Metamask' : '')}</p>

        <button onClick={this.stakingContract}>
          Staking
        </button>

        <p> {this.state.stakingContractAvailableTokens ? 'Available Tokens: ' + this.state.stakingContractAvailableTokens : ''} </p>
        <p> {this.state.stackingContractAddress ? 'Contract address: ' + this.state.stackingContractAddress : ''} </p>
      </div>
    );
  }
}

export default App;
