import { Scene } from 'phaser'
import ForestMap from '../entities/ForestMap'


class Forest extends Scene {

    /** @type {ForestMap} */
    map = null

    create() {
        this.onConnect()
    }

    onConnect() {
        const { fields, width } = this.cache.json.get('map/test')
        this.map = new ForestMap(this)
        this.map.draw(fields, width)
        this.add.existing(this.map)
    }

}

export default Forest