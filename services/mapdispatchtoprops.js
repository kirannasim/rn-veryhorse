import { bindActionCreators } from 'redux';

import { actions as IntlAction } from './intl';

// Object is composed by actions of services
const _joinObjectFunctions = (object) => {
	// Variables
	const functions = {};
	let key = null;
	let functionsName = null;

	// Object is composed by action objects. Every action object is composed by only functions
	for (key in object) {
		// Require Guarding for-in: https://eslint.org/docs/rules/guard-for-in
		if ({}.hasOwnProperty.call(object, key)) {
			const actions = object[key];

			// Every action objects should add to the fucntions variable the own methods
			for (functionsName in actions) {
				// Require Guarding for-in: https://eslint.org/docs/rules/guard-for-in
				if ({}.hasOwnProperty.call(actions, functionsName)) {
					functions[functionsName] = actions[functionsName];
				}
			}
		}
	}
	// Functions variable is a hash array composed of functions. It has only one level.
	return functions;
};

const mapDispatchToProps = (dispatch) => {
	const functions = _joinObjectFunctions({
		IntlAction
	});

	return bindActionCreators(functions, dispatch);
};

export default mapDispatchToProps;


