import {es,en,de,fr,it,nl} from '../../locales';

const setLanguage = (language) => {
	let messages = {};
	switch (language) {
		case 'en':
			messages = en;
			break;
		case 'es':
			messages = es;
            break;
        case 'de':
            messages = de;
            break;
        case 'fr':
            messages = fr;
            break;
        case 'it':
            messages = it;
            break;
        case 'nl':
            messages = nl;
            break;

	}
	return messages;
};

const initialState = {
	locale: 'en',
	messages: setLanguage('en')
};

const intlData = (state = initialState, action) => {
	if (action === undefined) return state;
	switch (action.type) {
		case "SetLanguage":
			return {
				locale: action.language,
				messages: setLanguage(action.language)
			};
		default:
			return state;
	}
};
export default intlData;