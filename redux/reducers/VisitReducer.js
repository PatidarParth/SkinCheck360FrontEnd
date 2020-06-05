import { AsyncStorage } from 'react-native';
import { combineReducers } from 'redux';

export const ACTION_INITIALIZE = 'visit/initialize';
export const ACTION_DELETE = 'visit/delete';
export const ACTION_ADD = 'visit/add';
export const ACTION_DELETE_PICTURE = 'visit/delete_picture';
export const ACTION_ADD_PICTURE = 'visit/add_picture';

const visitReducer = (state = {}, action) => {
  switch (action.type) {
    case ACTION_INITIALIZE:
      return { ...state, visitData: action.visitData };
    case ACTION_DELETE:
    case ACTION_DELETE_PICTURE:
    case ACTION_ADD:
    case ACTION_ADD_PICTURE:
      AsyncStorage.setItem('visitData', JSON.stringify(action.visitData));
      return { ...state, visitData: action.visitData };
    default:
      return state;
  }
};

export default combineReducers({
  visits: visitReducer
});
