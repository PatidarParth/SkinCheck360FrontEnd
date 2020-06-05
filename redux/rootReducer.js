import { combineReducers } from 'redux';
import visitReducer from './reducers/VisitReducer';

const rootReducer = combineReducers({
  visits: visitReducer
});

export default rootReducer;
