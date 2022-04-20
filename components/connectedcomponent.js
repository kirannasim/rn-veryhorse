import {connect} from 'react-redux';

import mapStateToProps from '../services/mapstatetoprops';
import mapDispatchToProps from '../services/mapdispatchtoprops';

export default InputComponent => {
  // High Order Component
  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(InputComponent);
};
