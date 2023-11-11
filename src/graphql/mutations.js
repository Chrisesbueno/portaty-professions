/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTags = /* GraphQL */ `
  mutation CreateTags(
    $input: CreateTagsInput!
    $condition: ModelTagsConditionInput
  ) {
    createTags(input: $input, condition: $condition) {
      id
      name
      objects {
        items {
          id
          tagsId
          activityId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTags = /* GraphQL */ `
  mutation UpdateTags(
    $input: UpdateTagsInput!
    $condition: ModelTagsConditionInput
  ) {
    updateTags(input: $input, condition: $condition) {
      id
      name
      objects {
        items {
          id
          tagsId
          activityId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTags = /* GraphQL */ `
  mutation DeleteTags(
    $input: DeleteTagsInput!
    $condition: ModelTagsConditionInput
  ) {
    deleteTags(input: $input, condition: $condition) {
      id
      name
      objects {
        items {
          id
          tagsId
          activityId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createActivity = /* GraphQL */ `
  mutation CreateActivity(
    $input: CreateActivityInput!
    $condition: ModelActivityConditionInput
  ) {
    createActivity(input: $input, condition: $condition) {
      id
      name
      tags {
        items {
          id
          tagsId
          activityId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateActivity = /* GraphQL */ `
  mutation UpdateActivity(
    $input: UpdateActivityInput!
    $condition: ModelActivityConditionInput
  ) {
    updateActivity(input: $input, condition: $condition) {
      id
      name
      tags {
        items {
          id
          tagsId
          activityId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteActivity = /* GraphQL */ `
  mutation DeleteActivity(
    $input: DeleteActivityInput!
    $condition: ModelActivityConditionInput
  ) {
    deleteActivity(input: $input, condition: $condition) {
      id
      name
      tags {
        items {
          id
          tagsId
          activityId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createActivityTags = /* GraphQL */ `
  mutation CreateActivityTags(
    $input: CreateActivityTagsInput!
    $condition: ModelActivityTagsConditionInput
  ) {
    createActivityTags(input: $input, condition: $condition) {
      id
      tagsId
      activityId
      tags {
        id
        name
        objects {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      activity {
        id
        name
        tags {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateActivityTags = /* GraphQL */ `
  mutation UpdateActivityTags(
    $input: UpdateActivityTagsInput!
    $condition: ModelActivityTagsConditionInput
  ) {
    updateActivityTags(input: $input, condition: $condition) {
      id
      tagsId
      activityId
      tags {
        id
        name
        objects {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      activity {
        id
        name
        tags {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteActivityTags = /* GraphQL */ `
  mutation DeleteActivityTags(
    $input: DeleteActivityTagsInput!
    $condition: ModelActivityTagsConditionInput
  ) {
    deleteActivityTags(input: $input, condition: $condition) {
      id
      tagsId
      activityId
      tags {
        id
        name
        objects {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      activity {
        id
        name
        tags {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createUsers = /* GraphQL */ `
  mutation CreateUsers(
    $input: CreateUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    createUsers(input: $input, condition: $condition) {
      id
      cognitoID
      name
      lastName
      email
      identityID
      favorites {
        items {
          id
          businessID
          userID
          position
          owner
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      business {
        items {
          id
          userID
          identityID
          name
          image
          email
          phone
          whatsapp
          instagram
          facebook
          page
          activity
          tags
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateUsers = /* GraphQL */ `
  mutation UpdateUsers(
    $input: UpdateUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    updateUsers(input: $input, condition: $condition) {
      id
      cognitoID
      name
      lastName
      email
      identityID
      favorites {
        items {
          id
          businessID
          userID
          position
          owner
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      business {
        items {
          id
          userID
          identityID
          name
          image
          email
          phone
          whatsapp
          instagram
          facebook
          page
          activity
          tags
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteUsers = /* GraphQL */ `
  mutation DeleteUsers(
    $input: DeleteUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    deleteUsers(input: $input, condition: $condition) {
      id
      cognitoID
      name
      lastName
      email
      identityID
      favorites {
        items {
          id
          businessID
          userID
          position
          owner
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      business {
        items {
          id
          userID
          identityID
          name
          image
          email
          phone
          whatsapp
          instagram
          facebook
          page
          activity
          tags
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createBusiness = /* GraphQL */ `
  mutation CreateBusiness(
    $input: CreateBusinessInput!
    $condition: ModelBusinessConditionInput
  ) {
    createBusiness(input: $input, condition: $condition) {
      id
      userID
      user {
        id
        cognitoID
        name
        lastName
        email
        identityID
        favorites {
          nextToken
          __typename
        }
        business {
          nextToken
          __typename
        }
        owner
        createdAt
        updatedAt
        __typename
      }
      identityID
      name
      image
      email
      phone
      whatsapp
      instagram
      facebook
      page
      coordinates {
        lat
        lon
        __typename
      }
      activity
      tags
      favorites {
        items {
          id
          businessID
          userID
          position
          owner
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateBusiness = /* GraphQL */ `
  mutation UpdateBusiness(
    $input: UpdateBusinessInput!
    $condition: ModelBusinessConditionInput
  ) {
    updateBusiness(input: $input, condition: $condition) {
      id
      userID
      user {
        id
        cognitoID
        name
        lastName
        email
        identityID
        favorites {
          nextToken
          __typename
        }
        business {
          nextToken
          __typename
        }
        owner
        createdAt
        updatedAt
        __typename
      }
      identityID
      name
      image
      email
      phone
      whatsapp
      instagram
      facebook
      page
      coordinates {
        lat
        lon
        __typename
      }
      activity
      tags
      favorites {
        items {
          id
          businessID
          userID
          position
          owner
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteBusiness = /* GraphQL */ `
  mutation DeleteBusiness(
    $input: DeleteBusinessInput!
    $condition: ModelBusinessConditionInput
  ) {
    deleteBusiness(input: $input, condition: $condition) {
      id
      userID
      user {
        id
        cognitoID
        name
        lastName
        email
        identityID
        favorites {
          nextToken
          __typename
        }
        business {
          nextToken
          __typename
        }
        owner
        createdAt
        updatedAt
        __typename
      }
      identityID
      name
      image
      email
      phone
      whatsapp
      instagram
      facebook
      page
      coordinates {
        lat
        lon
        __typename
      }
      activity
      tags
      favorites {
        items {
          id
          businessID
          userID
          position
          owner
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createFavorites = /* GraphQL */ `
  mutation CreateFavorites(
    $input: CreateFavoritesInput!
    $condition: ModelFavoritesConditionInput
  ) {
    createFavorites(input: $input, condition: $condition) {
      id
      businessID
      business {
        id
        userID
        user {
          id
          cognitoID
          name
          lastName
          email
          identityID
          owner
          createdAt
          updatedAt
          __typename
        }
        identityID
        name
        image
        email
        phone
        whatsapp
        instagram
        facebook
        page
        coordinates {
          lat
          lon
          __typename
        }
        activity
        tags
        favorites {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        owner
        __typename
      }
      userID
      user {
        id
        cognitoID
        name
        lastName
        email
        identityID
        favorites {
          nextToken
          __typename
        }
        business {
          nextToken
          __typename
        }
        owner
        createdAt
        updatedAt
        __typename
      }
      position
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateFavorites = /* GraphQL */ `
  mutation UpdateFavorites(
    $input: UpdateFavoritesInput!
    $condition: ModelFavoritesConditionInput
  ) {
    updateFavorites(input: $input, condition: $condition) {
      id
      businessID
      business {
        id
        userID
        user {
          id
          cognitoID
          name
          lastName
          email
          identityID
          owner
          createdAt
          updatedAt
          __typename
        }
        identityID
        name
        image
        email
        phone
        whatsapp
        instagram
        facebook
        page
        coordinates {
          lat
          lon
          __typename
        }
        activity
        tags
        favorites {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        owner
        __typename
      }
      userID
      user {
        id
        cognitoID
        name
        lastName
        email
        identityID
        favorites {
          nextToken
          __typename
        }
        business {
          nextToken
          __typename
        }
        owner
        createdAt
        updatedAt
        __typename
      }
      position
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteFavorites = /* GraphQL */ `
  mutation DeleteFavorites(
    $input: DeleteFavoritesInput!
    $condition: ModelFavoritesConditionInput
  ) {
    deleteFavorites(input: $input, condition: $condition) {
      id
      businessID
      business {
        id
        userID
        user {
          id
          cognitoID
          name
          lastName
          email
          identityID
          owner
          createdAt
          updatedAt
          __typename
        }
        identityID
        name
        image
        email
        phone
        whatsapp
        instagram
        facebook
        page
        coordinates {
          lat
          lon
          __typename
        }
        activity
        tags
        favorites {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        owner
        __typename
      }
      userID
      user {
        id
        cognitoID
        name
        lastName
        email
        identityID
        favorites {
          nextToken
          __typename
        }
        business {
          nextToken
          __typename
        }
        owner
        createdAt
        updatedAt
        __typename
      }
      position
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createComplaints = /* GraphQL */ `
  mutation CreateComplaints(
    $input: CreateComplaintsInput!
    $condition: ModelComplaintsConditionInput
  ) {
    createComplaints(input: $input, condition: $condition) {
      id
      userID
      businessID
      description
      status
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateComplaints = /* GraphQL */ `
  mutation UpdateComplaints(
    $input: UpdateComplaintsInput!
    $condition: ModelComplaintsConditionInput
  ) {
    updateComplaints(input: $input, condition: $condition) {
      id
      userID
      businessID
      description
      status
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteComplaints = /* GraphQL */ `
  mutation DeleteComplaints(
    $input: DeleteComplaintsInput!
    $condition: ModelComplaintsConditionInput
  ) {
    deleteComplaints(input: $input, condition: $condition) {
      id
      userID
      businessID
      description
      status
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createLogs = /* GraphQL */ `
  mutation CreateLogs(
    $input: CreateLogsInput!
    $condition: ModelLogsConditionInput
  ) {
    createLogs(input: $input, condition: $condition) {
      id
      userID
      type
      text
      businessID
      posI
      posE
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateLogs = /* GraphQL */ `
  mutation UpdateLogs(
    $input: UpdateLogsInput!
    $condition: ModelLogsConditionInput
  ) {
    updateLogs(input: $input, condition: $condition) {
      id
      userID
      type
      text
      businessID
      posI
      posE
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteLogs = /* GraphQL */ `
  mutation DeleteLogs(
    $input: DeleteLogsInput!
    $condition: ModelLogsConditionInput
  ) {
    deleteLogs(input: $input, condition: $condition) {
      id
      userID
      type
      text
      businessID
      posI
      posE
      name
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createTesting = /* GraphQL */ `
  mutation CreateTesting(
    $input: CreateTestingInput!
    $condition: ModelTestingConditionInput
  ) {
    createTesting(input: $input, condition: $condition) {
      id
      name
      coordinates {
        lat
        lon
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTesting = /* GraphQL */ `
  mutation UpdateTesting(
    $input: UpdateTestingInput!
    $condition: ModelTestingConditionInput
  ) {
    updateTesting(input: $input, condition: $condition) {
      id
      name
      coordinates {
        lat
        lon
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTesting = /* GraphQL */ `
  mutation DeleteTesting(
    $input: DeleteTestingInput!
    $condition: ModelTestingConditionInput
  ) {
    deleteTesting(input: $input, condition: $condition) {
      id
      name
      coordinates {
        lat
        lon
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
