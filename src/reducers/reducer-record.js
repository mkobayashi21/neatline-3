import initialState from './initialState-record';
import * as actionType from '../actions/action-types';

export default function(state = initialState, action) {
	switch (action.type) {

		// Handle response from create record API call
		case actionType.CREATE_RECORD_RESPONSE_RECEIVED:

			// Failed with error from API server
			if (typeof action.payload.errors !== 'undefined') {
				console.error(`CREATE_RECORD_ERROR: ${action.payload.errors.error}`);
				return {
					...state,
					error: 'Error Creating record'
				};

			// Accepted (RECORD_CREATED)
			} else {
				return {
					...state,
					loading: false,
					error: '',
					newRecord: action.record
				};
			}

		// Handle response from delete record API call
		case actionType.DELETE_RECORD_RESPONSE_RECEIVED:

			// Failed with error from API server
			if (typeof action.payload.errors !== 'undefined') {
				console.error(`DELETE_RECORD_ERROR: ${action.payload.errors.error}`);
				return {
					...state,
					error: 'Error deleting record'
				};

			// Accepted (RECORD_DELETED)
			} else {
				return {
					...state,
					loading: false,
					error: ''
				};
			}

		// Handle response from update record API call
		case actionType.UPDATE_RECORD_RESPONSE_RECEIVED:

			// Failed with error from API server
			if (typeof action.payload.errors !== 'undefined') {
				console.error(`UPDATE_RECORD_ERROR: ${action.payload.errors.error}`);
				return {
					...state,
					error: 'Error Updating record'
				};

				// Accepted
			} else {
				return {
					...state,
					loading: false,
					changedRecord: action.payload,
					error: ''
				};
			}

		// A wild error appeared!
		case actionType.RECORD_ERROR:
			console.error(`RECORD_ERROR: ${action.payload.error}`);
			return {
				...state,
				error: action.payload.message
			};

		// Reset
		case actionType.NEW_RECORD_RESET:
			return initialState;

		default:
			return state;
	}
}
