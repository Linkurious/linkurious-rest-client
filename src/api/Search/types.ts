/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {GenericObject, IDataSourceParams, IGetSubGraphParams} from '../commonTypes';
import {LkEdge, LkNode} from '../graphItemTypes';
import {EntityType} from '../GraphSchema';

export enum IndexationStatus {
  ONGOING = 'ongoing',
  DONE = 'done',
  NEEDED = 'needed'
}

export interface GetIndexationStatusResponse {
  indexing: IndexationStatus;
  indexingProgress?: string;
  indexingStatus: string;
  nodeCount?: number;
  edgeCount?: number;
  indexSize?: number;
  indexedSource?: string;
}

export interface ISearchParams extends IDataSourceParams {
  type: EntityType;
  q: string;
  fuzziness?: number;
  size?: number;
  from?: number;
  categoriesOrTypes?: [string];
  filter?: Array<[string, string]>;
}

export interface SearchResponse {
  searchQuery: SearchQuery;
  type: EntityType;
  totalHits?: number; // one among totalHits and moreResults is defined
  moreResults?: boolean;
  results: Array<LkNode | LkEdge>;
  itemTypeCount: GenericObject<string>;
}

export interface ISearchFullParams extends IGetSubGraphParams, ISearchParams {}

export enum SearchSyntaxErrorKey {
  /**
   * 1. Detectable errors by checking one statement
   */

  // Fuzzy-statement:
  // When fuzzy value is not an integer between 1 and 100
  INVALID_FUZZINESS = 'invalid-fuzziness',
  // When there are more than two fuzzy statements /
  SEVERAL_FUZZINESS = 'several-fuzziness',

  // Scope-statement:
  // When scope value is not in SearchQueryScope
  INVALID_SCOPE = 'invalid-scope',
  // When scope value already exists and is different
  CONFLICTING_SCOPES = 'conflicting-scopes',
  // When either nodes or edges are not searchable
  EDGES_NOT_SEARCHABLE = 'edges-not-searchable',

  // Type-statement:
  // When type value already exists and is different
  INCOMPATIBLE_TYPE_STATEMENTS = 'incompatible-type-statements',

  // Property-statement's value
  // Unsupported operator (not thrown in validator but in vendor)
  UNSUPPORTED_OPERATOR = 'unsupported-operator',

  /**
   * 2. Detectable errors by checking two statements
   */

  // Type-statement's value (depends on scope-statement)
  // When node category is not searchable
  NODE_TYPE_NOT_SEARCHABLE = 'node-type-not-searchable',
  // When edge type is not searchable
  EDGE_TYPE_NOT_SEARCHABLE = 'edge-type-not-searchable',

  // Property-statement (depends on scope-statement and type-statement)
  // When property is not searchable or visible in schema with/without itemType
  PROPERTIES_NOT_SEARCHABLE = 'properties-not-searchable',
  // When comparison operator is used with a property that is not a number (or date, and same for ranges)
  COMPARATOR_TYPE_MISMATCH = 'comparator-type-mismatch',
  // When comparison operator with invalid number (or date, and same for ranges)
  COMPARATOR_WITH_STRING = 'comparator-with-string',

  // SearchQuery
  // When there is no term or phrase, and there's at least another statement
  EMPTY_SEARCH = 'empty-search',

  /**
   * 3. Any other error
   */
  // When the grammar is invalid or any other unexpected error
  SYNTAX_ERROR = 'syntax-error'
}

export type SearchSyntaxError = {
  offset: [number, number]; // start and end index to highlight
} & (
  | {
      errorKey:
        | SearchSyntaxErrorKey.SEVERAL_FUZZINESS
        | SearchSyntaxErrorKey.CONFLICTING_SCOPES
        | SearchSyntaxErrorKey.EDGES_NOT_SEARCHABLE
        | SearchSyntaxErrorKey.INCOMPATIBLE_TYPE_STATEMENTS
        | SearchSyntaxErrorKey.UNSUPPORTED_OPERATOR
        | SearchSyntaxErrorKey.EMPTY_SEARCH
        | SearchSyntaxErrorKey.SYNTAX_ERROR;
    }
  | {
      errorKey: SearchSyntaxErrorKey.COMPARATOR_TYPE_MISMATCH;
      filterType: 'numerical' | 'date';
      propertyKey: string;
      propertyType: string;
      itemType?: string;
    }
  | {
      errorKey: SearchSyntaxErrorKey.COMPARATOR_WITH_STRING;
      filterType: 'numerical' | 'date';
      propertyValue: string;
    }
  | {
      errorKey:
        | SearchSyntaxErrorKey.EDGE_TYPE_NOT_SEARCHABLE
        | SearchSyntaxErrorKey.NODE_TYPE_NOT_SEARCHABLE;
      itemType: string;
    }
  | {
      errorKey: SearchSyntaxErrorKey.INVALID_FUZZINESS | SearchSyntaxErrorKey.INVALID_SCOPE;
      propertyValue: string;
    }
  | {
      errorKey: SearchSyntaxErrorKey.PROPERTIES_NOT_SEARCHABLE;
      propertyKeys: string[];
      itemType?: string;
    }
);

export type FilterStatement =
  | {
      key: string;
      min: string;
      max: string;
    }
  | {
      key: string;
      min: string;
    }
  | {
      key: string;
      max: string;
    };

export interface TermStatement {
  key?: string;
  term: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  prefix: boolean;
}

export interface PhraseStatement {
  key?: string;
  phrase: string;
  prefix: boolean;
}

/**
 * This interface represents a search query that has been parsed by LKE backend.
 * - The search query is divided into terms and pharses according the the search syntax specification.
 *   - see https://doc.linkurious.com/user-manual/latest/search-syntax/
 * - Please note that the terms generated by the backend are parsed but not tokenized.
 *   - e.g: Search query: "email:support@linkurious.com" --> Parsed term: ["support@linkurious.com"] --> Tokenized term --> ["support", "linkurious", "com"]
 */
export interface SearchQuery {
  fuzziness: number;
  entityType: EntityType;
  propertiesPerTypes: GenericObject<{
    text: string[];
    number: string[];
    date: string[];
    boolean: string[];
  }>;
  terms: TermStatement[];
  phrases: PhraseStatement[];
  filters: FilterStatement[];
}
/**
 * This interface represents a search query that has been parsed by LKE backend then tokenised.
 * - The search query is divided into terms and pharses according the the search syntax specification
 *   - After parsing the query, each term is tokenised according to the configured stopwords and special characters.
 *   - see https://doc.linkurious.com/user-manual/latest/search-syntax/
 *   - e.g: Search query: "email:support@linkurious.com" --> Parsed term: ["support@linkurious.com"] --> Tokenized term --> ["support", "linkurious", "com"]
 */
export interface TokenizedSearchQuery {
  terms: TermStatement[];
  phrases: PhraseStatement[];
}
