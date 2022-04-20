const updateLanguage = language => {
  return dispatch => {
    dispatch({
      type: "SetLanguage",
      language,
    });
  };
};

export default {
  updateLanguage,
};