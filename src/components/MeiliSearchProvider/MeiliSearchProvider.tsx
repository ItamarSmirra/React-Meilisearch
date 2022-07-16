import React, { PropsWithChildren, useState } from 'react';
import {MeiliSearch} from 'meilisearch';
import MeilisearchProviderContext from '../../context/MeiliSearchProviderContext';

interface MeilisearchProviderProps {
    client: MeiliSearch
}

const MeiliSearchProvider = ({client, children}: PropsWithChildren<MeilisearchProviderProps>) => {
    const [MeiliSearchClient] = useState<MeiliSearch>(client);

    const MelisearchProviderData = {
        client: MeiliSearchClient,
    }

    return (
        <MeilisearchProviderContext.Provider value={MelisearchProviderData}>
            { children }
        </MeilisearchProviderContext.Provider>
    )
}

export default MeiliSearchProvider;