// src/shared/interfaces/single.ts
export interface Segmentation {
    segmentation: string;
    value: number;
}
export class SegmentationImpl implements Segmentation {
    segmentation: string;
    value: number;

    constructor(
        segmentation: string,
        value: number
    ) {
        this.segmentation = segmentation;
        this.value = value;
    }
}
