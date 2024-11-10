// src/shared/interfaces/single.ts
export interface Show {
    id: number;
    date: Date;
    city: string;
    sales: number;


}
export class ShowImpl implements Show {
    id: number;
    date: Date;
    city: string;
    sales: number;

    constructor(
        id: number,
        date: Date,
        city: string,
        sales: number,
    ) {
        this.id = id;
        this.date = date;
        this.city = city;
        this.sales = sales;
    }

}
