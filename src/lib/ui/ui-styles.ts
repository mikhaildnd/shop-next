export type ControlShape = 'round' | 'rounded' | 'square';

export const controlShapeClasses: Record<ControlShape, string> = {
    round: 'control-shape-round',
    rounded: 'control-shape-rounded',
    square: 'control-shape-square',
};

export type ControlSize = 'xs' | 'sm' | 'md';

export const controlSizeClasses: Record<ControlSize, string> = {
    xs: 'control-size-xs',
    sm: 'control-size-sm',
    md: 'control-size-md',
};

export const controlHeightClasses: Record<ControlSize, string> = {
    xs: 'control-height-xs',
    sm: 'control-height-sm',
    md: 'control-height-md',
};
