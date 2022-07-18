import { MeiliSearchError } from 'meilisearch'
import { FetchMoreParameters } from '../../types';

const updateResult = (prev, fetchMoreResult) => (
    {
        ...prev,
        offset: fetchMoreResult.offset,
        hits: [...prev.hits, ...fetchMoreResult.hits]
    }
)

const useFetchMore = ({ MeilisearchClient, data, setData, searchConfig }) => {
    const fetchMore = (searchParameters: FetchMoreParameters = {
        ...searchConfig,
        updateResult,
    }) => {
        const params: FetchMoreParameters = { 
            ...searchConfig,
            ...searchParameters,
            options: { ...searchConfig.options, ...searchParameters.options },
            updateResult: searchParameters.updateResult ?? updateResult,
         };
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

    return fetchMore;
}

export default useFetchMore;