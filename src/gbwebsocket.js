class GBWebsocket {
    // Needs to be in sync with server!!!
    GAME_STATE_LOBBY = 0
    GAME_STATE_RUNNING = 1
    GAME_STATE_FINISHED = 2
    GAME_STATE_ERROR = 9998
    GAME_STATE_NONE = 9999

    constructor(url, name) {
        this.ws = new WebSocket(url);
        this.ws.onmessage = (function (event) {
            console.log(this);
            this.onMessage(event);
        }).bind(this); // required to this points to GBWebsocket, not the websocket instance.

        this.onconnected = function (gb) {
            console.log("On connected not implemented");
        }

        this.oninfoupdate = function (gb) {
            console.log("On info update not implemented!");
        }
        this.ongamestart = function (gb) {
            console.log("On game start not implemented!");
        }

        this.ongameupdate = function (gb) {
            console.log("Game update not implemented!");
        }

        this.ongameend = function (gb) {
            console.log("Game end not implemented!");
        }

        this.onuserinfo = function (gb) {
            console.log("User info not implemented!")
        }

        this.onmove = function (gb, lines) {
            console.log("OnMove not implemented!")
        }

        this.onwin = function (gb) {
            console.log("Win not implemented!")
        }
        console.log(this.ongameupdate);

        this.admin = false;
        this.name = name;
        this.game_name = "UNKNOWN";
        this.game_status = this.GAME_STATE_NONE;
        this.users = []
        this.uuid = ""
        this.waitForConnection();
    }

    sendRegisterMessage() {
        this.ws.send(JSON.stringify({
            "type": "register",
            "name": this.name
        }));
    }

    waitForConnection() {
        if (this.ws.readyState === 1) {
            console.log("Connection ready")
            // Send register message and alert state
            this.sendRegisterMessage();
            this.onconnected(this);
        } else {
            setTimeout(
                this.waitForConnection.bind(this),
                100
            );
        }
    }

    sendStart() {
        this.ws.send(JSON.stringify({
            "type": "start"
        }))
    }


    sendMove(pos) {
        console.log("Sending move to server", pos)
        this.ws.send(JSON.stringify({
            "type": "move",
            "pos": pos
        }))
    }

    static initiateGame(name) {
        var gb = new GBWebsocket("ws://185.244.193.69:5678/create", name);
        gb.admin = true;
        return gb;
    }

    static joinGame(name, code) {
        return new GBWebsocket("ws://185.244.193.69:5678/join/" + code, name)
    }

    onMessage(event) {
        console.log("onMessage");
        console.log(event);
        console.log("Parsed message:");
        var message = JSON.parse(event.data);
        console.log(message);

        switch (message.type) {
            case "game_info":
                console.log("New game info");
                this.game_name = message.name;
                this.game_status = message.state;
                this.users = message.users;
                this.oninfoupdate(this);
                break;
            case "user_info":
                this.uuid = message.uuid;
                this.onuserinfo(this);
                break;
            case "start_game":
                console.log("Game starting!");
                this.isXTurn = message.isxturn
                this.ongamestart(this);
                break;
            case "game_update":
                console.log("Game update!");
                this.ongameupdate(this);
                break;
            case "error":
                console.log("Error!")
                this.state = this.GAME_STATE_ERROR;
                this.ongameupdate(this);
                break;
            case "end":
                console.log("End!")
                this.state = this.GAME_STATE_FINISHED;
                this.ongameend(this);
                break;
            case "move":
                console.log("Received move msg | websocket")
                this.pos = message.pos
                this.isxturn = message.isxturn
                this.onmove(this);
                break;
            case "win":
                console.log("Lines")
                this.winner = message.winner
                this.onwin(this);
                break;
            default:
                console.log("Unknown message");
                console.log(message);
                break;
        }

    }
}

export { GBWebsocket };
