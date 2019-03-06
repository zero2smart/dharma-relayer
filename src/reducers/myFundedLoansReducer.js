import { FETCH_MY_FUNDED_LOANS_SUCCESS, SET_MY_FUNDED_LOANS_OFFSET } from '../actions';

export default function (state = {
  isLoading: true,
  values: [],
  showPaging: false,
  offset: 0,
  totalItemsCount: 0
}, action) {
  switch (action.type) {
    case FETCH_MY_FUNDED_LOANS_SUCCESS:
      if (state.offset !== action.offset) {   //that prevents situation when old data request resolved after new one
        return state;
      }
      return {
        ...state,
        isLoading: false,
        showPaging: action.debts && (action.debts.length > 0) && (action.debts.length !== action.totalItemsCount),
        totalItemsCount: action.totalItemsCount,
        values: action.debts
      };
    case SET_MY_FUNDED_LOANS_OFFSET:
      return { ...state, offset: action.offset, isLoading: true };
    default:
      return state;
  }
}