//  GraphQL Queries

export const listByUserOrdered = `
query listByUserOrdered($owner: String!) {
    listByUserOrdered(owner:$owner) { 
        items {
            id
            name
            date
            notes
            pictures(sortDirection: ASC) {
              items {
                id
                createdAt
                note
                location
                bodyPart
                locationX
                locationY
                diameter
                bucket
                fullsize {
                  key
                }
                faceDetectedValues {
                  leftEarXPosition
                  leftEarYPosition
                  rightEarXPosition
                  rightEarYPosition
                  noseBaseXPosition
                  noseBaseYPosition
                }
              }
            }
        }
    }
}`;

export const newVisitEntry = `mutation newVisitEntry($name: String!, $date: AWSDateTime!, $notes: String!){
  createVisitEntry(input:{name:$name, date:$date, notes:$notes}) {
    id
  }
}`;


export const deleteVisitEntry = `mutation deleteVisitEntry($id: ID) {
  deleteVisitEntry(input:{id: $id}) {
      id
      name
  }
}`;

export const updateVisitEntry = `mutation updateVisitEntry($id: ID!, $name: String!, $date: AWSDateTime!, $notes: String!){
  updateVisitEntry(input:{id:$id, name:$name, date:$date, notes:$notes}) {
    id
    name
  }
}`;

// eslint-disable-next-line max-len
export const createPicture = `mutation createPicture($leftEarXPosition: Float!, $leftEarYPosition: Float!, $rightEarXPosition: Float!, $rightEarYPosition: Float!, $noseBaseXPosition: Float!, $noseBaseYPosition: Float!, $key: String!, $pictureSize: Int!, $pictureId: ID!, $pictureNote: String!, $pictureLocation: String!, $pictureBodyPart: String!, $picturelocationX: Float!, $picturelocationY: Float!, $pictureDiameter: Float!, $pictureVisitEntryId: ID, $bucket: String!){
  createPicture(input: {faceDetectedValues: {leftEarXPosition: $leftEarXPosition, leftEarYPosition: $leftEarYPosition, rightEarXPosition: $rightEarXPosition, rightEarYPosition: $rightEarYPosition, noseBaseXPosition: $noseBaseXPosition, noseBaseYPosition: $noseBaseYPosition}, fullsize: {key:$key, width: $pictureSize, height: $pictureSize}, id: $pictureId, note: $pictureNote, location: $pictureLocation, bodyPart: $pictureBodyPart, locationX: $picturelocationX, locationY: $picturelocationY, diameter: $pictureDiameter, pictureVisitEntryId: $pictureVisitEntryId, bucket: $bucket}) {
    id
    bucket
  }
}`;

export const deletePicture = `mutation deletePicture($pictureId: ID!){
  deletePicture(input: {id: $pictureId}) {
    id
    bucket
  }
}`;

export const getVisitEntry = `query getVisitEntry($visitId: ID!){
  getVisitEntry(id: $visitId) {
    id
    name
    id      
    date
    notes
    pictures(sortDirection: ASC) {
      items {
        id
        createdAt
        note
        location
        bodyPart
        locationX
        locationY
        diameter
        bucket
        fullsize {
          key
        }
        faceDetectedValues {
          leftEarXPosition
          leftEarYPosition
          rightEarXPosition
          rightEarYPosition
          noseBaseXPosition
          noseBaseYPosition
        }
      }
    }
  }
}`;
