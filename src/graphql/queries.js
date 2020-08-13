/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getVisitEntry = /* GraphQL */ `
  query GetVisitEntry($id: ID!) {
    getVisitEntry(id: $id) {
      id
      owner
      name
      date
      notes
      pictures {
        items {
          id
          note
          location
          bodyPart
          locationX
          locationY
          diameter
          bucket
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listVisitEntrys = /* GraphQL */ `
  query ListVisitEntrys(
    $filter: ModelVisitEntryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVisitEntrys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        name
        date
        notes
        pictures {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPicture = /* GraphQL */ `
  query GetPicture($id: ID!) {
    getPicture(id: $id) {
      id
      note
      location
      bodyPart
      locationX
      locationY
      diameter
      visitEntry {
        id
        owner
        name
        date
        notes
        pictures {
          nextToken
        }
        createdAt
        updatedAt
      }
      bucket
      fullsize {
        key
        width
        height
      }
      faceDetectedValues {
        leftEarXPosition
        leftEarYPosition
        rightEarXPosition
        rightEarYPosition
        noseBaseXPosition
        noseBaseYPosition
      }
      createdAt
      updatedAt
    }
  }
`;
export const listPictures = /* GraphQL */ `
  query ListPictures(
    $filter: ModelPictureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPictures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        note
        location
        bodyPart
        locationX
        locationY
        diameter
        visitEntry {
          id
          owner
          name
          date
          notes
          createdAt
          updatedAt
        }
        bucket
        fullsize {
          key
          width
          height
        }
        faceDetectedValues {
          leftEarXPosition
          leftEarYPosition
          rightEarXPosition
          rightEarYPosition
          noseBaseXPosition
          noseBaseYPosition
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getIsPrivatePolicyAccepted = /* GraphQL */ `
  query GetIsPrivatePolicyAccepted($id: ID!) {
    getIsPrivatePolicyAccepted(id: $id) {
      id
      username
      isPrivatePolicyAccepted
      createdAt
      updatedAt
    }
  }
`;
export const listIsPrivatePolicyAccepteds = /* GraphQL */ `
  query ListIsPrivatePolicyAccepteds(
    $filter: ModelisPrivatePolicyAcceptedFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listIsPrivatePolicyAccepteds(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        username
        isPrivatePolicyAccepted
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listByUserOrdered = /* GraphQL */ `
  query ListByUserOrdered(
    $owner: String
    $date: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelVisitEntryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listByUserOrdered(
      owner: $owner
      date: $date
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        name
        date
        notes
        pictures {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
