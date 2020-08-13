/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateVisitEntry = /* GraphQL */ `
  subscription OnCreateVisitEntry {
    onCreateVisitEntry {
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
export const onUpdateVisitEntry = /* GraphQL */ `
  subscription OnUpdateVisitEntry {
    onUpdateVisitEntry {
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
export const onDeleteVisitEntry = /* GraphQL */ `
  subscription OnDeleteVisitEntry {
    onDeleteVisitEntry {
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
export const onCreatePicture = /* GraphQL */ `
  subscription OnCreatePicture {
    onCreatePicture {
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
export const onUpdatePicture = /* GraphQL */ `
  subscription OnUpdatePicture {
    onUpdatePicture {
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
export const onDeletePicture = /* GraphQL */ `
  subscription OnDeletePicture {
    onDeletePicture {
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
export const onCreateIsPrivatePolicyAccepted = /* GraphQL */ `
  subscription OnCreateIsPrivatePolicyAccepted {
    onCreateIsPrivatePolicyAccepted {
      id
      username
      isPrivatePolicyAccepted
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateIsPrivatePolicyAccepted = /* GraphQL */ `
  subscription OnUpdateIsPrivatePolicyAccepted {
    onUpdateIsPrivatePolicyAccepted {
      id
      username
      isPrivatePolicyAccepted
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteIsPrivatePolicyAccepted = /* GraphQL */ `
  subscription OnDeleteIsPrivatePolicyAccepted {
    onDeleteIsPrivatePolicyAccepted {
      id
      username
      isPrivatePolicyAccepted
      createdAt
      updatedAt
    }
  }
`;
