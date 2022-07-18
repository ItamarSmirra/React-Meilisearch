# React-Meilisearch
The React client api for integreting with [Meilisearch Server](https://www.meilisearch.com/).<br>
It includes several simple hooks to help you integrate with your search server.<br>
We based on the [meilisearch](https://www.npmjs.com/package/meilisearch) npm package.

# Install
```sh
npm install react-meilisearch
```

# Getting Started
#### Initialization <!-- omit in toc -->
First you need to initialize a melisearch client and connect it to React.
```javascript
import {MeiliSearchProvider, MeiliSearchClient} from 'react-meilisearch';
import './App.css'

const App = () => {
  const meilisearch = new MeiliSearchClient({
    host: 'http://127.0.0.1:7700',
    apiKey: 'masterKey',
  })

  return (
    <MeiliSearchProvider client={meilisearch}>
      // ... rest of App.jsx
    </MeiliSearchProvider>
  )
}

export default App

```
### Use MeilisearchClient <!-- omit in toc -->
Use this hook to get the meilisearch client and use it's normal methods described in the [meilisearch]([https://www.npmjs.com/package/meilisearch](https://www.npmjs.com/package/meilisearch#getting-started)) npm package.
```javascript
import { useState } from 'react';
import { useMeiliSearchClient } from 'react-meilisearch';

const UseMeiliSearchClientExample = () => {
    const meilisearchClient = useMeiliSearchClient();
    const [searchResults, setSearchResults] = useState(null);

    const onChange = (event) => {
        meilisearchClient.index('movies').search(event.target.value)
        .then(setSearchResults);
    }
    
    return (
        <div>
            <input onChange={onChange} />
            {
                searchResults &&
                <div>results count {searchResults.hits.length}</div>
            }
        </div>
    )
}

export default UseMeiliSearchClientExample;
```

### Use Search <!-- omit in toc -->
This hook gets a query, index adn advanced search options, trigger the search and return the current state of the search.
In the example we use it along with a 'query' search parameter, using the [use-search-params](https://reactrouter.com/docs/en/v6/hooks/use-search-params) hook.
```javascript
import { useSearch } from 'react-meilisearch';
import { useSearchParams } from 'react-router-dom';

const UseLazySearchExample = () => {
    const [searchParams] = useSearchParams();
    const { loading, error, data } = useSearch({ index: 'movies', query: searchParams.get('query') });

    if (loading) return 'Loading...';
    if (error) return 'Error!';
    
    return (
        <div>
            {
                data &&
                <div>results count {data.hits.length}</div>
            }
        </div>
    )
}

export default UseLazySearchExample;
```
### Parameters <!-- omit in toc -->
| parameter | type | description | default value |
| ------ | ------ | ------ | ------ |
| query | string | the query to search by | '' |
| index | string | the melisearch index to search in | '' |
| options | SearchParams | meilisearch search options described in the [documentation](https://docs.meilisearch.com/reference/api/search.html#search-parameters) | { limit: 30 } |

### Return Value <!-- omit in toc -->
| parameter | type | description |
| ------ | ------ | ------ |
| loading | boolean | is the search in progress |
| error | MeiliSearchError / null | an error occured in the search request |
| data | SearchResponse<Record<string, any>> / undefined / null | the search result |
| refetch | (SearchArguments (same as the hook parameters)) => void | method to refetch the search |
| fetchMore | (FetchMoreParameters (same as the hook parameters with the callback updateResult)) => void | method to fetch more results, read [Infinite Scroll]() for more details | 
