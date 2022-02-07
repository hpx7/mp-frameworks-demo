import { GameObjects } from 'phaser'

class ForestMap extends GameObjects.Container {

    constructor(scene) {
        super(scene, 0, 0)
    }

    /**
     * 
     * @param {Array<boolean>} fields 
     * @param {number} fieldWidth 
     */
    draw(fields, fieldWidth) {
        for (let [index, isGround] of fields.entries()) {
            let x = Math.floor(index % fieldWidth)
            let y = Math.floor(index / fieldWidth)
            let fieldTexture = null
            if (isGround) {
                fieldTexture = `tileset/ground_field_${index % 5}`
            } else {
                fieldTexture = `tileset/forest_field_${index % 10}`
            }
            let field = this.scene.add.sprite(x * 150, y * 150, fieldTexture).setOrigin(.5, 1)
            this.add(field)
        }
    }

}

export default ForestMap