import initialState from './initialState-map';
import * as actionType from '../actions/action-types';

export default function app(state = initialState, action) {

	switch (action.type) {

		// Set the tilelayer object based on an ID (array position)
		case actionType.SET_TILELAYER:
			return {
				...state,
				current: {
					...state.current,
					tileLayer: state.available.baseMaps[action.payload.id]
				}
			};

		// Create a subset of tilelayer objects based on array of IDs
		case actionType.SET_AVAILABLE_TILELAYERS:
			let availableOptions = [];
			action.payload.ids.forEach((thisID, key, map) => {
				availableOptions.push(state.available.baseMaps[thisID]);
			});
			return {
				...state,
				current: {
					...state.current,
					basemapOptions: availableOptions
				}
			};
		default:
			return state;
	}
}
