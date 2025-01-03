// src/shared/interfaces/single.ts
export interface Show {
    id: number;
    date: Date;
    city: string;
    sales: number;
    isStadium: boolean;


}
export class ShowImpl implements Show {
    id: number;
    date: Date;
    city: string;
    sales: number;
    isStadium: boolean;


    constructor(
        id: number,
        date: Date,
        city: string,
        sales: number,
        isStadium: boolean
    ) {
        this.id = id;
        this.date = date;
        this.city = city;
        this.sales = sales;
        this.isStadium = isStadium;
    }

}
