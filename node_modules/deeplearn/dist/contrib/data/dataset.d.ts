import { BatchDataset } from './batch_dataset';
import { DatasetStatistics } from './statistics';
import { DataStream } from './streams/data_stream';
import { DatasetElement } from './types';
export declare abstract class Dataset {
    abstract getStream(): Promise<DataStream<DatasetElement>>;
    computeStatistics(sampleSize?: number, shuffleWindowSize?: number): Promise<DatasetStatistics>;
    filter(filterer: (value: DatasetElement) => boolean | Promise<boolean>): Dataset;
    map(transform: (value: DatasetElement) => DatasetElement | Promise<DatasetElement>): Dataset;
    batch(batchSize: number, smallLastBatch?: boolean): BatchDataset;
    concatenate(dataset: Dataset): Dataset;
    repeat(count?: number): Dataset;
    take(count: number): Dataset;
    skip(count: number): Dataset;
    shuffle(bufferSize: number, seed?: string, reshuffleEachIteration?: boolean): Dataset;
    prefetch(bufferSize: number): Dataset;
}
export declare function datasetFromStreamFn(getStreamFn: () => Promise<DataStream<DatasetElement>>): Dataset;
export declare function datasetFromElements(items: DatasetElement[]): Dataset;
export declare function datasetFromConcatenated(datasets: Dataset[]): Dataset;
