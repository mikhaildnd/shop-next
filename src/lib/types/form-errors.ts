export type FormErrors<T> = {
    [K in keyof T]?: string;
};
