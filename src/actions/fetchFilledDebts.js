import debtsApi from '../common/api/debts';
import * as loanStatuses from '../common/loanStatuses';
import {getDefaultAccount} from '../common/services/web3Service';
import {fromDebtOrder} from '../common/services/dharmaService';

export const FETCH_FILLED_DEBTS = 'FETCH_FILLED_DEBTS';
export const FETCH_FILLED_DEBTS_SUCCESS = 'FETCH_FILLED_DEBTS_SUCCESS';
export const FETCH_FILLED_DEBTS_FAIL = 'FETCH_FILLED_DEBTS_FAIL';

const fetchFilledDebtsStart = () => ({
  type: FETCH_FILLED_DEBTS
});

const fetchFilledDebtsSuccess = (debts) => ({
  type: FETCH_FILLED_DEBTS_SUCCESS,
  debts
});

export function fetchFilledDebts(){
  return dispatch => {
    dispatch(fetchFilledDebtsStart());

    let defaultAccount = getDefaultAccount();
    if(defaultAccount){
      return debtsApi.getAll(loanStatuses.FILLED, defaultAccount)
        .then(async(debts) => {
          let mappedDebts = [];
          for(var i=0; i<debts.length; i++){
            let dharmaDebt = await fromDebtOrder(debts[i]);
            mappedDebts.push({...dharmaDebt, creationTime: debts[i].creationTime});
          }
          dispatch(fetchFilledDebtsSuccess(mappedDebts));
        });
    }

    return
  }
}