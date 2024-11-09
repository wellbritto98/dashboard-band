// src/shared/interfaces/single.ts
export interface Single {
    title: string;
    sells: number;
    lastSell: number;
    lastSellDate: Date;
    artistGain: number;
    recordLabelGain: number;
    totalGain: number;
    evaluation: number;
    imageUrl: string;
    releaseDate: Date;
    stock: number;
}

export class SingleImpl implements Single {
    title: string;
    sells: number;
    lastSell: number;
    lastSellDate: Date;
    artistGain: number;
    recordLabelGain: number;
    totalGain: number;
    evaluation: number;
    imageUrl: string;
    releaseDate: Date;
    stock: number;

    constructor(
        title: string,
        sells: number,
        lastSell: number,
        lastSellDate: Date,
        artistGain: number,
        recordLabelGain: number,
        evaluation: number,
        imageUrl: string,
        releaseDate: Date,
        stock: number
    ) {
        this.title = title;
        this.sells = sells;
        this.lastSell = lastSell;
        this.lastSellDate = lastSellDate;
        this.artistGain = artistGain;
        this.recordLabelGain = recordLabelGain;
        this.totalGain = artistGain + recordLabelGain;
        this.evaluation = evaluation;
        this.imageUrl = imageUrl;
        this.releaseDate = releaseDate;
        this.stock = stock;
    }
}
