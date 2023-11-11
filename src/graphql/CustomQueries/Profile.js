export const listActivities = /* GraphQL */ `
  query ListActivities(
    $filter: ModelActivityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listActivities(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        tags {
          items {
            tags {
              name
            }
          }
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const userByEmail = /* GraphQL */ `
  query UserByEmail(
    $email: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUsersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userByEmail(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cognitoID
        name
        lastName
        email
        identityID
        business {
          items {
            id
            userID
            name
            image
            email
            phone
            whatsapp
            instagram
            facebook
            page
            favorites {
              items {
                id
              }
            }
            coordinates {
              lat
              lon
            }
            activity
            tags
          }
        }
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

