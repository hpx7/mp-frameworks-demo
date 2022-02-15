import { Scene } from 'phaser'
import { Direction } from '../../../api/types'
import { HathoraConnection } from '../../.hathora/client'
import ForestMap from '../objects/ForestMap'
import Player from '../objects/Player'
import PlayerInputObserver from '../PlayerInputObserver'


class Forest extends Scene {

    /** @type {HathoraConnection} */
    connection = null
    
    /** @type {Player} */
    mainPlayer = null

    playerInput = new PlayerInputObserver()

    /** @type {Map<string,Player>} */
    players = new Map()

    /** @type {ForestMap} */
    map = null

    create({ client, token, roomId }) {

        if (roomId === undefined) {
            client
              .connectNew(
                token,
                ({ state }) => this.stateUpdate(state),
                console.error
              )
              .then((connection) => {
                this.connection = connection
                let url = new URL(window.location.href);
                url.searchParams.append("roomId", connection.stateId);
                window.history.replaceState({}, null, url.toString());
              });
        } else {
            this.connection = client.connectExisting(
              token,
              roomId,
              ({ state }) => this.stateUpdate(state),
              console.error
            );
        }
    }

    stateUpdate(state) {
        if (this.map === null) {
            this.drawForest(state.walls, state.width)
        }
        state.players.forEach(({ x, y }) => {
            // TODO use real id
            if (!this.players.has("id")) {
                this.createPlayer("id", x, y, false, false, false, false, true)
            } else {
                this.players.get("id").move(false, false, false, false, x, y)
            }
        })
    }

    /**
     * 
     * @param {Array<boolean>} fields 
     * @param {number} width 
     */
    drawForest(fields, width) {
        this.map = new ForestMap(this)
        this.map.draw(fields, width)
        this.add.existing(this.map)
        this.map.setPipeline('Light2D')
        this.lights.enable()
        this.lights.setAmbientColor(0x000000)
        this.physics.add.collider(this.map.list)
        this.physics.add.overlap(this.map.list, ()=> {}, null, this)
        const { width: mapWidth, height: mapHeight } = this.map.getBounds()
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    }

    createPlayer(id, x, y, up, down, left, right, controlled = false) {
        let player = new Player(this)

        this.players.set(id, player)
        this.map.add(player)
        player.move(up, down, left, right, x, y)
        if (controlled) {
            this.playerInput.enable(true, this)
            this.cameras.main.startFollow(player)
            this.playerInput.on('state', state => {
                const { up, down, left, right } = state
                const { x, y } = player
                console.log("move", up, down, left, right, x, y)
                if (up) {
                    this.connection.setDirection({ direction: Direction.UP })
                } else if (down) {
                    this.connection.setDirection({ direction: Direction.DOWN })
                } else if (left) {
                    this.connection.setDirection({ direction: Direction.LEFT })
                } else if (right) {
                    this.connection.setDirection({ direction: Direction.RIGHT })
                } else {
                    this.connection.setDirection({ direction: Direction.NONE })
                }
                player.move(up, down, left, right)
            })
        }
    }

}

export default Forest