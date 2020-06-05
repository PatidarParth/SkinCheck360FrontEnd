/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-unused-vars: "off" */
/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */

import * as FileSystem from 'expo-file-system';
import { AsyncStorage } from 'react-native';
import { dispatch } from 'redux';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import Moment from 'moment';
import {
  ACTION_INITIALIZE,
  ACTION_DELETE,
  ACTION_ADD,
  ACTION_DELETE_PICTURE,
  ACTION_ADD_PICTURE
} from './reducers/VisitReducer';

function actionInitialize(visits) {
  return {
    type: ACTION_INITIALIZE,
    visitData: visits
  };
}

function actionDeleteVisit(visits) {
  return {
    type: ACTION_DELETE,
    visitData: visits
  };
}

function actionAddVisit(visits) {
  return {
    type: ACTION_ADD,
    visitData: visits
  };
}

function actionDeletePicture(visits) {
  return {
    type: ACTION_DELETE_PICTURE,
    visitData: visits
  };
}

function actionAddPicture(visits) {
  return {
    type: ACTION_ADD_PICTURE,
    visitData: visits
  };
}

export function fetchVisits() {
  return function action(dispatch) {
    return AsyncStorage.getItem('visitData').then((data) => dispatch(actionInitialize(JSON.parse(data))));
  };
}

export function deleteVisit(visitData, visitId) {
  return function action(dispatch) {
    return Object.keys(visitData).map((key) => {
      if (key === visitId) {
        if (visitData[key].visitPictures) {
          visitData[key].visitPictures.map((picture) => FileSystem.deleteAsync(picture.uri));
        }
        delete visitData[key];
        dispatch(actionDeleteVisit(visitData));
      }
      return 0;
    });
  };
}

export function addVisit(visitData, visitId, visitName, visitDate, visitNotes) {
  return function action(dispatch) {
    if (!visitData) {
      visitData = {};
    }

    if (!visitData[visitId]) {
      visitData[visitId] = {};
    }

    visitData[visitId].visitName = visitName;
    visitData[visitId].visitDate = visitDate;
    visitData[visitId].visitId = visitId;
    visitData[visitId].visitNotes = visitNotes;
    visitData[visitId].visitPictures = [];
    dispatch(actionAddVisit(visitData));
  };
}

export function deletePicture(visitData, visitId, pictureUri) {
  return function action(dispatch) {
    FileSystem.deleteAsync(pictureUri);
    if (visitData) {
      const newPictureData = _.remove(visitData[visitId].visitPictures,
        ((picture) => picture.uri !== pictureUri));

      visitData[visitId].visitPictures = newPictureData;

      dispatch(actionDeletePicture(visitData));
    }
  };
}

export function addPicture(visitData, visitId, pictureUri, pictureNote,
  pictureLocation, pictureBodyPart, pictureId, locationX, locationY, diameter) {
  return function action(dispatch) {
    if (!visitData[visitId].visitPictures) {
      visitData[visitId].visitPictures = [];
    }

    if (pictureId) {
      const newVisitPictures = visitData[visitId].visitPictures.map((picture) => {
        if (picture.pictureId === pictureId) {
          picture.pictureNote = pictureNote;
          picture.pictureLocation = pictureLocation;
          picture.pictureBodyPart = pictureBodyPart;
          picture.uri = pictureUri;
          picture.locationX = locationX;
          picture.locationY = locationY;
          picture.diameter = diameter;
        }
        return picture;
      });
    } else {
      visitData[visitId].visitPictures.push({
        pictureId: pictureId || uuidv4(),
        uri: pictureUri,
        pictureNote,
        pictureLocation,
        pictureBodyPart,
        locationX,
        locationY,
        diameter,
        dateCreated: Moment().format('MM/DD/YYYY hh:mm A')
      });
    }
    dispatch(actionAddPicture(visitData));
  };
}
