import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import user from './not_refactored/user';
import exhibits from './not_refactored/exhibits';
import exhibitShow from './not_refactored/exhibitShow';
import exhibitCreate from './not_refactored/exhibitCreate';
import exhibitUpdate from './not_refactored/exhibitUpdate';
import exhibitDelete from './not_refactored/exhibitDelete';
import recordMapLayers from './not_refactored/recordMapLayers';

import recordReducer from './reducer-record.js';
import mapReducer from './reducer-map.js';
export default combineReducers({
  routing: routerReducer,
  form: formReducer,
  user,
  exhibits,
  exhibitShow,
  exhibitCreate,
  exhibitUpdate,
  exhibitDelete,

  record: recordReducer,
  map: mapReducer,
  recordMapLayers:recordMapLayers
});
