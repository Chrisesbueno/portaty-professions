export const searchBusinessByDistance = /* GraphQL */ `
  query SearchBusinessByDistance(
    $location: LocationInput!
    $km: Float
    $text: String!
  ) {
    searchBusinessByDistance(location: $location, km: $km, text: $text) {
      items {
        name
      }
      total
      nextToken
    }
  }
`;

export const searchBusinesses = /* GraphQL */ `
  query SearchBusinesses(
    $filter: SearchableBusinessFilterInput
    $sort: [SearchableBusinessSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableBusinessAggregationInput]
  ) {
    searchBusinesses(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        userID
        name
        image
        email
        description
        phone
        whatsapp
        instagram
        facebook
        page
        activity
        tags
        owner
        createdAt
        updatedAt
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;

export const getBusiness = /* GraphQL */ `
  query GetBusiness($id: ID!) {
    getBusiness(id: $id) {
      id
      userID
      identityID
      name
      image
      images
      thumbnail
      email
      phone
      whatsapp
      instagram
      description
      facebook
      page
      coordinates {
        lat
        lon
      }
      activity
      tags
      favorites {
        items {
          id
          businessID
          position
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const getBusinessFavorites = /* GraphQL */ `
  query GetBusiness($id: ID!) {
    getBusiness(id: $id) {
      id
      favorites {
        items {
          id
        }
      }
    }
  }
`;