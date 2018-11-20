import { AdadeltaOptimizer } from './optimizers/adadelta_optimizer';
import { AdagradOptimizer } from './optimizers/adagrad_optimizer';
import { AdamOptimizer } from './optimizers/adam_optimizer';
import { AdamaxOptimizer } from './optimizers/adamax_optimizer';
import { MomentumOptimizer } from './optimizers/momentum_optimizer';
import { RMSPropOptimizer } from './optimizers/rmsprop_optimizer';
import { SGDOptimizer } from './optimizers/sgd_optimizer';
export declare const train: {
    sgd: (learningRate: number) => SGDOptimizer;
    momentum: (learningRate: number, momentum: number) => MomentumOptimizer;
    adadelta: (learningRate?: number, rho?: number, epsilon?: number) => AdadeltaOptimizer;
    adagrad: (learningRate: number, initialAccumulatorValue?: number) => AdagradOptimizer;
    rmsprop: (learningRate: number, decay?: number, momentum?: number, epsilon?: number) => RMSPropOptimizer;
    adamax: (learningRate?: number, beta1?: number, beta2?: number, epsilon?: number, decay?: number) => AdamaxOptimizer;
    adam: (learningRate?: number, beta1?: number, beta2?: number, epsilon?: number) => AdamOptimizer;
};
