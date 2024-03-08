export const onUpdateUsers = /* GraphQL */ `
  subscription OnUpdateUsers(
    $filter: ModelSubscriptionUsersFilterInput
    $owner: String
  ) {
    onUpdateUsers(filter: $filter, owner: $owner) {
      id
      favorites {
        items {
          id
          businessID
          userID
        }
      }

    }
  }
`;