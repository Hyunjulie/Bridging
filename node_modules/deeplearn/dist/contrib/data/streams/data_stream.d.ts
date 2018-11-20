import { RingBuffer } from '../util/ring_buffer';
export declare function streamFromItems<T>(items: T[]): DataStream<T>;
export declare function streamFromIncrementing(start: number): DataStream<number>;
export declare function streamFromFunction<T>(func: () => T | Promise<T>): DataStream<T>;
export declare function streamFromConcatenated<T>(baseStreams: DataStream<DataStream<T>>): Promise<DataStream<T>>;
export declare function streamFromConcatenatedFunction<T>(streamFunc: () => DataStream<T>, count: number): Promise<DataStream<T>>;
export declare abstract class DataStream<T> {
    abstract next(): Promise<T>;
    collectRemaining(): Promise<T[]>;
    resolveFully(): Promise<void>;
    filter(predicate: (value: T) => boolean | Promise<boolean>): DataStream<T>;
    map<S>(transform: (value: T) => S | Promise<S>): DataStream<S>;
    forEach(f: (value: T) => {} | Promise<{}>): Promise<void>;
    batch(batchSize: number, smallLastBatch?: boolean): DataStream<T[]>;
    concatenate(stream: DataStream<T>): Promise<DataStream<T>>;
    take(count: number): DataStream<T>;
    skip(count: number): DataStream<T>;
    prefetch(bufferSize: number): DataStream<T>;
    shuffle(windowSize: number, seed?: string): DataStream<T>;
}
export declare abstract class QueueStream<T> extends DataStream<T> {
    protected outputQueue: RingBuffer<T>;
    constructor();
    protected abstract pump(): Promise<boolean>;
    next(): Promise<T>;
}
export declare class ChainedStream<T> extends DataStream<T> {
    private currentPromise;
    static create<T>(baseStreams: DataStream<DataStream<T>>): Promise<ChainedStream<T>>;
    next(): Promise<T>;
}
export declare class PrefetchStream<T> extends DataStream<T> {
    protected upstream: DataStream<T>;
    protected bufferSize: number;
    protected buffer: RingBuffer<Promise<T>>;
    total: number;
    constructor(upstream: DataStream<T>, bufferSize: number);
    protected refill(): void;
    next(): Promise<T>;
}
export declare class ShuffleStream<T> extends PrefetchStream<T> {
    protected upstream: DataStream<T>;
    protected windowSize: number;
    private random;
    private upstreamExhausted;
    constructor(upstream: DataStream<T>, windowSize: number, seed?: string);
    private randomInt(max);
    protected chooseIndex(): number;
    next(): Promise<T>;
}
