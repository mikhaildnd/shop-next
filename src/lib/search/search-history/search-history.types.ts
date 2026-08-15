export type SearchHistoryItem =
    | {
          type: 'query';
          query: string;
      }
    | {
          type: 'category';
          title: string;
          slug: string;
      }
    | {
          type: 'product';
          title: string;
          slug: string;
          thumbnail: string | null;
      };

export interface SearchHistoryState {
    items: SearchHistoryItem[];
    save(item: SearchHistoryItem): void;
    remove(item: SearchHistoryItem): void;
    clearHistory(): void;
}
