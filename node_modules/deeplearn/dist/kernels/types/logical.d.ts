import { KernelNode } from '../../tape_types';
import { Tensor } from '../../tensor';
import { DataType } from '../../types';
export interface EqualNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            a: Tensor;
            b: Tensor;
        };
    };
    output: Tensor;
    gradient: (dy: Tensor, y: Tensor) => {
        a: () => Tensor;
        b: () => Tensor;
    };
}
export interface LogicalNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            a: Tensor;
            b: Tensor;
        };
    };
    output: Tensor;
    gradient: (dy: Tensor, y: Tensor) => {
        a: () => Tensor;
        b: () => Tensor;
    };
}
export interface WhereNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            condition: Tensor;
            a: Tensor;
            b: Tensor;
        };
        args: {
            dtype: DataType;
        };
    };
    output: Tensor;
    gradient: (dy: Tensor, y: Tensor) => {
        condition: () => Tensor;
        a: () => Tensor;
        b: () => Tensor;
    };
}
