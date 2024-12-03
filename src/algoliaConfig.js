// algoliaConfig.js

import { liteClient as algoliasearch } from 'algoliasearch/lite';
//import * as algoliasearch from 'algoliasearch/lite';


import { algoliaAppId, algoliaSearchKey } from './APIKEY_SECRETS/ALGOLIA_KEY';

const searchClient = algoliasearch(algoliaAppId, algoliaSearchKey);



// console.log('Algolia App ID:', algoliaAppId);
// console.log('Algolia Search Key:', algoliaSearchKey);
// console.log('Search Client:', searchClient);
// console.log('Available Methods on Search Client:', Object.keys(searchClient));

export { searchClient };
