import { useContext } from 'react';
import MeiliSearchProviderContext from '../../context/MeiliSearchProviderContext';

const useMeiliSearchClient = () => {
    const Meilisearch = useContext(MeiliSearchProviderContext);
    return Meilisearch.client;
}

export default useMeiliSearchClient;