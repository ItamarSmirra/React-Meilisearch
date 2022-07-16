import { MeiliSearch } from 'meilisearch';

export type MeilisearchContext = {
    client: MeiliSearch | null;
}