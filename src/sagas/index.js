import { urlFormat, recordsEndpoint } from './api_helper.js';
import {put,takeLatest,all} from 'redux-saga/effects';
import * as actions from '../actions/action-types';

const JSON_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

// Export only a single rollup point
export default function* rootSaga() {
	yield all([
		takeLatest(actions.RECORD_CREATE, createRecord),
		takeLatest(actions.RECORD_DELETE, deleteRecord),
		takeLatest(actions.RECORD_UPDATE, updateRecord),
	])
}

// Create a record
function* createRecord(action) {
	try{
		let url = urlFormat(recordsEndpoint);
		const response = yield fetch(url,{
							method: 'POST',
							headers: JSON_HEADERS,
							body: JSON.stringify(action.payload)});
		let response_json = yield response.json();
		yield put({type: actions.CREATE_RECORD_RESPONSE_RECEIVED, payload:response_json});
 		//dispatch(push(`${window.baseRoute}/show/${getState().exhibitShow.exhibit['o:slug']}/edit/${createdRecord['o:id']}`);

	// Failed on the fetch call (timeout, etc)
    }catch(e) {
		yield put({	type: actions.RECORD_ERROR,
					payload: {
						record:'',
						message:'Error Creating Record',
						error:e
					}});
    }
}

// Delete a record
function* deleteRecord(action) {
	let record = action.payload;
	if (window.confirm(`Are you sure you want to delete the Neatline record "${record['o:title']}"?`)) {
		debugger
		try{
			console.log(urlFormat(recordsEndpoint, {}, record['o:id']));
			const response = yield fetch(urlFormat(recordsEndpoint, {}, record['o:id']),{method: 'DELETE'});
			let response_json = yield response.json();
			yield put({type: actions.DELETE_RECORD_RESPONSE_RECEIVED, payload:response_json});

		// Failed on the fetch call (timeout, etc)
		}catch(e) {
			yield put({	type: actions.RECORD_ERROR,
						payload: {
							record:record,
							message:'Error Deleting Record',
							error:e
						}});
		}
	}

}

// Update a record
function* updateRecord(action) {
	let record = action.payload;
	try{
		let url = urlFormat(recordsEndpoint, {}, record['o:id']);
		const response = yield fetch(url,{
							method: 'PATCH',
							headers: JSON_HEADERS,
							body: JSON.stringify(record)});
		let response_json = yield response.json();
		yield put({type: actions.UPDATE_RECORD_RESPONSE_RECEIVED, payload:response_json});
 		//dispatch(push(`${window.baseRoute}/show/${getState().exhibitShow.exhibit['o:slug']}/edit/${createdRecord['o:id']}`);

	// Failed on the fetch call (timeout, etc)
	}catch(e) {
		yield put({	type: actions.RECORD_ERROR,
					payload: {
						record:record,
						message:'Error Updating Record',
						error:e
					}});

    }
}
