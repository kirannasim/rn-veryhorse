import I18n from 'react-native-i18n';
import {en,es,nl,it,fr,de} from '../locales';

I18n.fallbacks = true;
I18n.translations = {
  en,
  es,
  nl,
  it,
  fr,
  de
};

export default I18n;