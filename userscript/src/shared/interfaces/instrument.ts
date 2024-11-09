// src/shared/interfaces/single.ts
export interface Instrument {
    id: number;
    name: string;
    quality: number;

}
export class InstrumentImpl implements Instrument {
    id: number
    name: string;
    quality: number;

    constructor(
        id: number,
        name: string,
    ) {
        this.id= id;
        this.name = name;  
    }
}
