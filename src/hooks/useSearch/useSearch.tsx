import { useState, useEffect } from 'react';
import { SearchResponse, MeiliSearchError } from 'meilisearch'
import useMeiliSearchClient from '../useMeiliSearchClient/useMeiliSearchClient';
import { SearchArguments, FetchMoreParameters, UseSearchResult } from '../../types';

const useSearch = ({query, index, options }: SearchArguments) : UseSearchResult => {
    const [searchConfig, setsearchConfig] = useState<SearchArguments>({
        query, index, options, 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<MeiliSearchError | null>(null);
    const [data, setData] = useState<SearchResponse<Record<string, any>> | undefined | null>(null);
    const MeilisearchClient = useMeiliSearchClient();

    const refetch = (searchParameters: SearchArguments = { 
        ...searchConfig
    }) => {
        setsearchConfig({ ...searchConfig, ...searchParameters });
    }

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
        .then((results: SearchResponse<Record<string, any>>) => {
            if (data && results) {
                setData(params.updateResult(data, results));
            }
        }).catch((error: MeiliSearchError) => {
            if (params.onError) {
                params.onError(error);
            }
        });
    }

    useEffect(() => {
        setLoading(true);
        MeilisearchClient?.index(searchConfig.index).search(searchConfig.query, searchConfig.options)
        .then((results: SearchResponse<Record<string, any>>) => {
            setData(results);
        }).catch((error: MeiliSearchError) => {
            setError(error);
        }).finally(() => setLoading(false));
    }, [searchConfig, MeilisearchClient, setLoading, setError, setData]);

    return { loading, error, data, refetch, fetchMore };
}

export default useSearch;