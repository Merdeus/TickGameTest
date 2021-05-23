import React from 'react';

class Player extends React.Component {
    // Needs to be in sync with server
    STATE_ALIVE = 0
    STATE_DEAD = 1
    STATE_WINNER = 2
    render() {
        if (this.props.user.state === this.STATE_ALIVE) {
            return (
                <div className="col-4 player-div">

                    <p className="plyinfo" ><b>{this.props.user.name}</b><br />
                    Level: {this.props.user.level}</p>
                </div>
            )
        } else if (this.props.user.state === this.STATE_DEAD) {
            return (
                <div className="col-4 player-div">

                    <p><b>{this.props.user.name}</b><br />
                    Game Over</p>
                </div>
            )
        } else if (this.props.user.state === this.STATE_WINNER) {
            return (
                <div className="col-4 player-div">

                    <p><b>{this.props.user.name}</b><br />
                    Winner!!!</p>
                </div>
            )
        }
    }
}

export { Player };
