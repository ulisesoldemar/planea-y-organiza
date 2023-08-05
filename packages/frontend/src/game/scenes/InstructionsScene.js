import BaseScene from "@/game/scenes/BaseScene";

export default class InstructionsScene extends BaseScene {
    constructor() {
        super('InstructionsScene', 'instructions');
        this.maxTime = 1000; // Tiempo de la prueba en segundos
        this.pathTraveled = [];
        this.distanceTraveled = 0.0;
    }

    create() {
        
    }
}