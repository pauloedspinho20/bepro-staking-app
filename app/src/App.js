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
      network: ""
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
    }
  }

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

  render() {
    return (
      <div className="App">
        <h1>Stacking App</h1>
        {this.state.isConnected ?
          <div>
            <p>{this.state.address}</p>
            <p>{this.state.network}</p>
          </div> :
          ""
        }

        <button onClick={this.connectWallet}>
          {!this.state.isConnected ? "Connect to Metamask" : "Connected"}
        </button>
        <p> {((this.state.network !== this.state.appNetwork && this.state.isWeb3Detected && this.state.isConnected) ? 'Please connect to Kovan Network' : '')}</p>
        <p> {((!this.state.isWeb3Detected) ? 'Please install Metamask' : '')}</p>
      </div>
    );
  }
}

export default App;
