import { Instrument } from "./instrument";

export interface Bandmate {
    id: number;
    name: string;
    sq: number;
    friendship: number;
    romance: number;
    hate: number;
    instruments?: Instrument[];
}

export class BandmateImpl implements Bandmate {
    id: number;
    name: string;
    sq: number;
    friendship: number;
    romance: number;
    hate: number;
    instruments?: Instrument[];

    constructor(
        id: number,
        name: string,
        sq: number,
        friendship: number,
        romance: number,
        hate: number,
        instruments?: Instrument[]
    ) {
        this.id = id;
        this.name = name;
        this.sq = sq;
        this.friendship = friendship;
        this.romance = romance;
        this.hate = hate;
        this.instruments = instruments;
    }
}