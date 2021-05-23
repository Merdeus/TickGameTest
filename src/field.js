import React from 'react';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: props.isXTurn,
        };
        props.test(this)

    }

    BoardMove(gb) {
        console.log("Internal Board Move.", gb)
        const squares = this.state.squares.slice();
        squares[parseInt(gb.pos)] = (gb.isxturn ? 'O' : 'X');
        this.setState({
            squares: squares,
            xIsNext: gb.isxturn,
        });

    }

    handleClick(i) {

        console.log(this.props.isX, this.props.isXTurn, this.state.xIsNext)
        const squares = this.state.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        if (this.props.isX && this.state.xIsNext) {
            squares[i] = 'X';
            this.setState({
                squares: squares,
                xIsNext: !this.state.xIsNext,
            });

            this.props.onMove(i);
        } else {
            if (!this.props.isX && !this.state.xIsNext) {
                squares[i] = 'O';
                this.setState({
                    squares: squares,
                    xIsNext: !this.state.xIsNext,
                });

                this.props.onMove(i);
            }
        }



    }
    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    renderInfo() {
        return (
            <div>
                {'User UUID: ' + this.props.uuid}
                <br />
                {'GameID: ' + this.props.game_code}
                <br />
                <br />
                {'You are: ' + (this.props.isX ? 'X' : 'O')}
                <br />
                {'Player at turn: ' + (this.state.xIsNext ? 'X' : 'O')}
            </div>
        )
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = (<div>{'Winner: ' + winner}<br />{'Returning to lobby in 10 seconds'}</div>);
        } else {
            status = this.renderInfo()
        }

        return (
            <div className="game">
                <div className="game-board">
                    <div>
                        <div className="status">{status}</div>
                        <div className="board-row">
                            {this.renderSquare(0)}
                            {this.renderSquare(1)}
                            {this.renderSquare(2)}
                        </div>
                        <div className="board-row">
                            {this.renderSquare(3)}
                            {this.renderSquare(4)}
                            {this.renderSquare(5)}
                        </div>
                        <div className="board-row">
                            {this.renderSquare(6)}
                            {this.renderSquare(7)}
                            {this.renderSquare(8)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

export { Board };