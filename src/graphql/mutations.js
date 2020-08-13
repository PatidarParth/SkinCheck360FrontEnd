/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createVisitEntry = /* GraphQL */ `
  mutation CreateVisitEntry(
    $input: CreateVisitEntryInput!
    $condition: ModelVisitEntryConditionInput
  ) {
    createVisitEntry(input: $input, condition: $condition) {
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
export const updateVisitEntry = /* GraphQL */ `
  mutation UpdateVisitEntry(
    $input: UpdateVisitEntryInput!
    $condition: ModelVisitEntryConditionInput
  ) {
    updateVisitEntry(input: $input, condition: $condition) {
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
export const deleteVisitEntry = /* GraphQL */ `
  mutation DeleteVisitEntry(
    $input: DeleteVisitEntryInput!
    $condition: ModelVisitEntryConditionInput
  ) {
    deleteVisitEntry(input: $input, condition: $condition) {
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
export const createPicture = /* GraphQL */ `
  mutation CreatePicture(
    $input: CreatePictureInput!
    $condition: ModelPictureConditionInput
  ) {
    createPicture(input: $input, condition: $condition) {
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
export const updatePicture = /* GraphQL */ `
  mutation UpdatePicture(
    $input: UpdatePictureInput!
    $condition: ModelPictureConditionInput
  ) {
    updatePicture(input: $input, condition: $condition) {
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
export const deletePicture = /* GraphQL */ `
  mutation DeletePicture(
    $input: DeletePictureInput!
    $condition: ModelPictureConditionInput
  ) {
    deletePicture(input: $input, condition: $condition) {
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
export const createUserAttributeInformation = /* GraphQL */ `
  mutation CreateUserAttributeInformation(
    $input: CreateUserAttributeInformationInput!
    $condition: ModeluserAttributeInformationConditionInput
  ) {
    createUserAttributeInformation(input: $input, condition: $condition) {
      id
      username
      isPrivatePolicyAccepted
      createdAt
      updatedAt
    }
  }
`;
export const updateUserAttributeInformation = /* GraphQL */ `
  mutation UpdateUserAttributeInformation(
    $input: UpdateUserAttributeInformationInput!
    $condition: ModeluserAttributeInformationConditionInput
  ) {
    updateUserAttributeInformation(input: $input, condition: $condition) {
      id
      username
      isPrivatePolicyAccepted
      createdAt
      updatedAt
    }
  }
`;
export const deleteUserAttributeInformation = /* GraphQL */ `
  mutation DeleteUserAttributeInformation(
    $input: DeleteUserAttributeInformationInput!
    $condition: ModeluserAttributeInformationConditionInput
  ) {
    deleteUserAttributeInformation(input: $input, condition: $condition) {
      id
      username
      isPrivatePolicyAccepted
      createdAt
      updatedAt
    }
  }
`;
