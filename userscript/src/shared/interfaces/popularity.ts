// src/shared/interfaces/single.ts
export interface Popularity {
    city: string;
    popularity: number;
    fame: number;
}
export class PopularityImpl implements Popularity {
    city: string;
    popularity: number;
    fame: number;

    constructor(
        city: string,
        popularity: number,
        fame: number,
    ) {
        this.city = city;
        this.popularity = popularity;
        this.fame = fame;
    }
}
