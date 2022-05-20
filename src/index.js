import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


import { GBWebsocket } from './gbwebsocket.js';
import { SelectGame } from './selectgame.js';
import { Lobby } from './lobby.js';
import { Board } from './field.js';

class OnlineTick extends React.Component {

  StateConnect = "Connect";
  StateConnecting = "Connecting";
  StateJoiningGame = "JoiningGame";
  StateLobby = "Lobby";
  StateStartingGame = "StartingGame";
  StateJoinGame = "SelectJoinGame";
  StateInGame = "InGame";

  constructor(props) {
    super(props);
    this.state = {
      state: this.StateConnect,
      doesXstart: true,
      name: "Foo",
      game_code: "",
      users: [],
      level: 0,
      difficulty: 0,
      uuid: "",
      admin: false
    }
  }


  handleJoinGame(name, game_code) {
    console.log("Join game");
    console.log(name);
    console.log(game_code);
    this.setState({
      state: this.StateJoiningGame,
      admin: false,
      name: name,
      game_code: game_code
    })
    this.gb = GBWebsocket.joinGame(name, game_code);
    this.setGbCallbacks()
  }

  handleCreateGame(name) {
    this.setState({
      state: this.StateConnecting
    });

    console.log("Clicked Create Game!")
    this.gb = GBWebsocket.initiateGame(name);
    console.log("created game " + this.gb.admin)
    this.setGbCallbacks()
  }

  handleStartGame() {
    console.log("Trying to start game!");
    if (this.state.users.length !== 2) { return; }
    this.gb.sendStart();
    this.setState({
      state: this.StateStartingGame
    });
  }

  handleMove(pos) {
    console.log("handleMove");
    console.log(pos);
    this.gb.sendMove(pos);
  }

  gbConnected(gb) {
    console.log("We're connected!");
    console.log(gb.users)
    this.setState({
      game_code: gb.game_name,
      users: gb.users,
      state: this.StateLobby,
      admin: this.gb.admin
    });
  }

  gbInfoUpdate(gb) {
    console.log("Info Update!");
    console.log(gb.users)
    this.setState({
      game_code: gb.game_name,
      users: gb.users,
      state: this.StateLobby
    });
  }

  gbGameStart(gb) {
    console.log(this);
    console.log("Got game start.")
    this.setState({
      state: this.StateInGame,
      doesXstart: gb.isXTurn
    });
  }


  TestMove(board) {
    console.log("1 Test Move.", this, this.gb)
    console.log(board.state.squares)
    this.gb.onmove = board.BoardMove.bind(board, this.gb);
  }

  setGbCallbacks() {
    this.gb.onconnected = this.gbConnected.bind(this);
    this.gb.oninfoupdate = this.gbInfoUpdate.bind(this);
    this.gb.ongamestart = this.gbGameStart.bind(this);
    /*this.gb.ongameupdate = this.gbGameUpdate.bind(this);
    this.gb.onuserinfo = this.gbUserInfo.bind(this);
    this.gb.onlines = this.gbLines.bind(this);
    this.gb.onwin = this.gbWin.bind(this);*/
  }




  render() {
    if (this.state.state === this.StateConnect) {
      return (
        <div className="connect">
          <h2 className="cover-heading">Online Tick Tack Toe</h2>
          <p className="lead">Start a new game or join an exisiting one!</p>
          <hr />
          <SelectGame onCreateGame={(name) => this.handleCreateGame(name)} onJoinGame={(name, code) => this.handleJoinGame(name, code)} />
          <small>Version: 0.3</small>
        </div>
      )
    } else if (this.state.state === this.StateConnecting) {
      return (
        <div className="connect">
          <h2>Connecting...</h2>
        </div>
      )
    } else if (this.state.state === this.StateJoiningGame) {
      return (<div className="connect">
        <h2>Connecting to game server...</h2>
      </div>)
    } else if (this.state.state === this.StateLobby) {
      return (<div className="connect">
        <Lobby game_code={this.state.game_code} users={this.state.users} admin={this.state.admin} onStartGame={() => this.handleStartGame()} />
      </div>)
    } else if (this.state.state === this.StateStartingGame) {
      return (<div className="connect">
        <h2>Starting game...</h2>
      </div>)

    } else if (this.state.state === this.StateInGame) {
      return (<div className="connect">
        <Board isXTurn={this.state.doesXstart} game_code={this.state.game_code} uuid={this.gb.uuid} isX={this.state.admin} test={(board) => this.TestMove(board)} onMove={(pos) => this.handleMove(pos)} />
      </div>)

    } else if (this.state.state === this.StateFinished) {
      return (<div className="connect">
        <h2>Game finished!</h2>
      </div>)
    } else {
      return (
        <div>Invalid state | {this.state.state}</div>
      )
    }
  }
}

// ========================================

ReactDOM.render(
  <OnlineTick />,
  document.getElementById('root')
);
