import { useState, useCallback } from 'react';
import { SearchResponse, MeiliSearchError } from 'meilisearch'
import useMeiliSearchClient from '../useMeiliSearchClient/useMeiliSearchClient';
import { SearchArguments, FetchMoreParameters, UseSearchResult } from '../../types';

const useLazySearch = 
({query, index, options }: SearchArguments): [(searchParameters?: SearchArguments) => void, UseSearchResult] => {
    const [searchConfig] = useState<SearchArguments>({
        query, index, options, 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<MeiliSearchError | null>(null);
    const [data, setData] = useState<SearchResponse<Record<string, any>> | undefined | null>(null);
    const MeilisearchClient = useMeiliSearchClient();

    const fetchMore = (searchParameters: FetchMoreParameters = {
        ...searchConfig,
        updateResult: (prev, fetchMoreResult) => (
            {
                ...prev,
                offset: fetchMoreResult.offset,
                hits: [...prev.hits, ...fetchMoreResult.hits]
            }
        ),
    }) => {
        const params: FetchMoreParameters = { ...searchConfig, ...searchParameters };
        MeilisearchClient?.index(params.index).search(params.query, params.options)
        .then((results) => {
            if (data && results) {
                setData(params.updateResult(data, results));
            }
        }).catch((error: MeiliSearchError) => {
            if (params.onError) {
                params.onError(error);
            }
        });
    }

    const search = useCallback((searchParameters: SearchArguments = searchConfig) => {
        const params = { ...searchConfig, ...searchParameters };
            MeilisearchClient?.index(params.index).search(params.query, params.options)
            .then((results) => {
                setData(results);
            }).catch((error: MeiliSearchError) => {
                setError(error);
            }).finally(() => setLoading(false));
    }, [MeilisearchClient, setData, setError, setLoading, searchConfig])

    return [search, { loading, error, data, fetchMore }];
}

export default useLazySearch;