import { useState, useCallback } from 'react';
import { SearchResponse, MeiliSearchError } from 'meilisearch'
import useMeiliSearchClient from '../useMeiliSearchClient/useMeiliSearchClient';
import { SearchArguments, UseSearchResult } from '../../types';
import useFetchMore from '../useFetchMore/useFetchMore';

const useLazySearch = 
(props: SearchArguments = {query: '', index: '', options: {} }): [(query: string, searchParameters?: SearchArguments) => void, UseSearchResult] => {
    const [searchConfig] = useState<SearchArguments>({
        ...props, options: { ...props.options, limit: props.options?.limit ?? 20 }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<MeiliSearchError | null>(null);
    const [data, setData] = useState<SearchResponse<Record<string, any>> | undefined | null>(null);
    const MeilisearchClient = useMeiliSearchClient();
    const fetchMore = useFetchMore({MeilisearchClient, data, setData, searchConfig});

    const search = useCallback((query: string, searchParameters: SearchArguments = searchConfig) => {
        const params = { ...searchConfig, ...searchParameters, query };
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