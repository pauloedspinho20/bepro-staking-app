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
      isConnected: false
    };
  }

  getAddress = async () => {
    
  }

  connectWallet = async () => {
    if (!this.state.isConnected) {
      let app = new Application({ opt: { web3Connection: 'WEB3_LINK' } });
      if (app) {
        await app.login();
        this.setState({ isConnected: true });
      }
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Stacking App</h1>
        <p>{this.state.data}</p>
        <button onClick={this.connectWallet}>
          {!this.state.isConnected ? "Connect to Metamask" : "Connected"}
        </button>
      </div>
    );
  }
}

export default App;
