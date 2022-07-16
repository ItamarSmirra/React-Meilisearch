import { SearchParams, SearchResponse, MeiliSearchError } from 'meilisearch'

export type SearchArguments = {
    query: string;
    index: string;
    options: SearchParams;
}

export type FetchMoreParameters = SearchArguments & {
    updateResult: (prev: SearchResponse<Record<string, any>>,
                   fetchMoreResult: SearchResponse<Record<string, any>>) 
                    => SearchResponse<Record<string, any>>,
    onError?: (error: MeiliSearchError) => void;
}

export type UseSearchResult = {
    loading: boolean;
    error: MeiliSearchError | null;
    data: SearchResponse<Record<string, any>> | undefined | null;
    refetch?: (searchParameters: SearchArguments) => void;
    fetchMore: (searchParameters: FetchMoreParameters) => void;
}