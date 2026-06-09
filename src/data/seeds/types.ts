export type CategorySeed = {
    slug: string;
    title: string;

    children?: CategorySeed[];
};
