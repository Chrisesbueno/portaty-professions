export const onUpdateBusiness = /* GraphQL */ `
  subscription OnUpdateBusiness(
    $filter: ModelSubscriptionBusinessFilterInput
    $owner: String
  ) {
    onUpdateBusiness(filter: $filter, owner: $owner) {
      id
      image
      images
      favorites {
        items {
          id
        }
      }
    }
  }
`;

export const onUpdateFavorites = /* GraphQL */ `
  subscription OnUpdateFavorites(
    $filter: ModelSubscriptionFavoritesFilterInput
    $owner: String
  ) {
    onUpdateFavorites(filter: $filter, owner: $owner) {
      id
      businessID
      user {
        id
        cognitoID
      }
    }
  }
`;