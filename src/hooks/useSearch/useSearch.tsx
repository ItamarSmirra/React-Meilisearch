import { useState, useEffect } from 'react';
import { SearchResponse, MeiliSearchError } from 'meilisearch'
import useMeiliSearchClient from '../useMeiliSearchClient/useMeiliSearchClient';
import { SearchArguments, UseSearchResult } from '../../types';
import useFetchMore from '../useFetchMore/useFetchMore';

const useSearch = (props: SearchArguments = {query: '', index: '', options: {} }) : UseSearchResult => {
    const [searchConfig, setsearchConfig] = useState<SearchArguments>({
        ...props
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<MeiliSearchError | null>(null);
    const [data, setData] = useState<SearchResponse<Record<string, any>> | undefined | null>(null);
    const MeilisearchClient = useMeiliSearchClient();
    const fetchMore = useFetchMore({MeilisearchClient, data, setData, searchConfig});

    const refetch = (searchParameters: SearchArguments = { 
        ...searchConfig
    }) => {
        setsearchConfig({ 
            ...searchConfig,
            ...searchParameters,
                options: { ...searchConfig.options, ...searchParameters.options }
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