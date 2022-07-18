# React-Meilisearch
The React client api for integrating with [Meilisearch Server](https://www.meilisearch.com/).<br>
It includes several simple hooks to help you integrate with your search server.<br>
We based it on the [meilisearch](https://www.npmjs.com/package/meilisearch) npm package.

# Install
```sh
npm install react-meilisearch
```

# Getting Started
### Initialization <!-- omit in toc -->
First you need to initialize a meilisearch client and connect it to React.
```javascript
import { MeiliSearchProvider, MeiliSearchClient } from 'react-meilisearch';
import './App.css'

const App = () => {
  const meilisearch = new MeiliSearchClient({
    host: 'http://localhost:7700',
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

## UseSearch Hook <!-- omit in toc -->
This hook recieves a query, index and advanced search options, triggers the search and returns the current state of the search.
```javascript
const { loading, error, data } = useSearch({ index: 'movies', query: 'Comedy' });
```

#### Full Example: <!-- omit in toc -->
In the following example we used the hook along with a 'query' search parameter, using the [use-search-params](https://reactrouter.com/docs/en/v6/hooks/use-search-params) hook.
```javascript
import { useSearch } from 'react-meilisearch';
import { useSearchParams } from 'react-router-dom';

const UseSearchExample = () => {
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

export default UseSearchExample;
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
| fetchMore | (FetchMoreParameters (same as the hook parameters with the callback updateResult)) => void | method to fetch more results, read [Infinite Scroll](#infinite-scroll) for more details | 


## UseLazySearch Hook <!-- omit in toc -->
Works the same way as Use Search hook, but returns a search funtion instead of triggering it when the component is mounted.
```javascript
const [search, { loading, error, data }] = useLazySearch({ index: 'movies' });
search('Comedy');
```

#### Full Example: <!-- omit in toc -->
```javascript
import { useLazySearch } from 'react-meilisearch';

const UseLazySearchExample = () => {
    const [search, { loading, error, data }] = useLazySearch({ index: 'movies' });

    if (loading) return 'Loading...';
    if (error) return 'Error!';

    return (
        <div>
            <input onChange={(event) => {
                search(event.target.value, { options: {
                    limit: 100
                } });
            }} />
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
| search function | (SearchArguments (same as the hook parameters)) => void | Trigger a search using the given parameters. The function parameters overide the hook parameters |
| loading | boolean | is the search in progress |
| error | MeiliSearchError / null | an error occured in the search request |
| data | SearchResponse<Record<string, any>> / undefined / null | the search result |
| fetchMore | (FetchMoreParameters (same as the hook parameters with the callback updateResult)) => void | method to fetch more results, read [Infinite Scroll](#infinite-scroll) for more details | 

## UseMeilisearchClient Hook <!-- omit in toc -->
Use this hook to get the meilisearch client and use it's normal methods described in the [meilisearch](https://www.npmjs.com/package/meilisearch) npm package.
```javascript
const meilisearchClient = useMeiliSearchClient();
```

#### Full Example: <!-- omit in toc -->
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

## Infinite Scroll
You can easily implement infinite scroll or pagination search using the fetchMore function.<br>
In the example below we used [react-infinite-scroll-hook](https://www.npmjs.com/package/react-infinite-scroll-hook) npm package to handle the scroll events. Feel free to change it to whatever you want.

```javascript
import { useSearch } from 'react-meilisearch';
import useInfiniteScroll  from 'react-infinite-scroll-hook';
import './infiniteScrollExample.css';

const InfiniteScrollExample = ({ query }) => {
    const { loading, error, data, fetchMore } = useSearch({ query, index: 'movies', options: {
        limit: 30,
        offset: 0,
    } });

    const hasNextPage = data && data.estimatedTotalHits > data.hits.length;
    const loadMore = () => fetchMore({ options: { offset: data.hits.length }});

    const [sentryRef, { rootRef }] = useInfiniteScroll({
        loading,
        hasNextPage,
        onLoadMore: loadMore,
        disabled: !!error,
        rootMargin: '0px 0px 200px 0px',
      });

    if (loading) return 'Loading...';
    if (error) return 'Error!';

    return (
        <div className='infinite-scroll' ref={rootRef}>
            {
                data && data.hits.map(hit => (
                    <div key={hit.key}>{hit.title}</div>
                ))
            }
            {
                (loading || hasNextPage) && (
                    <div ref={sentryRef}/>
                  )
            }
        </div>
    )
}

export default InfiniteScrollExample;
```
The default behavior of the fetchMore result is to concat the result hits with the previous data hits.<br>
You can override this behavior by giving the fetchMore an alternative updateResult callback. Make sure you are returning the new data value.
```javascript
const updateResult = (prev, fetchMoreResult) => {
    console.log('I am overriding the default updateResult function');
    return (
    {
        ...prev,
        offset: fetchMoreResult.offset,
        hits: [...prev.hits, ...fetchMoreResult.hits]
    })
}
const loadMore = () => fetchMore({ options: {offset: data.hits.length}, updateResult });
 ```
 
 ## Types
 All of the meilisearch types are available for you, in addition to these new ones:
 ```javascript
type SearchArguments = {
    query: string;
    index: string;
    options: SearchParams;
}

type FetchMoreParameters = SearchArguments & {
    updateResult: (prev: SearchResponse<Record<string, any>>,
                   fetchMoreResult: SearchResponse<Record<string, any>>) 
                    => SearchResponse<Record<string, any>>,
    onError?: (error: MeiliSearchError) => void;
}

type UseSearchResult = {
    loading: boolean;
    error: MeiliSearchError | null;
    data: SearchResponse<Record<string, any>> | undefined | null;
    refetch?: (searchParameters: SearchArguments) => void;
    fetchMore: (searchParameters: FetchMoreParameters) => void;
}
 ```
 
 ## License

[MIT](LICENSE)
