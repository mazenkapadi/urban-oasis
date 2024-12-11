import { liteClient as algoliasearch } from 'algoliasearch/lite';

import { algoliaAppId, algoliaSearchKey } from './APIKEY_SECRETS/ALGOLIA_KEY';

const searchClient = algoliasearch(algoliaAppId, algoliaSearchKey);

export { searchClient };
