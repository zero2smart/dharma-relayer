import debtsApi from '../common/api/debts';
import * as loanStatuses from '../common/loanStatuses';
import {
    fromDebtOrder
} from '../common/services/dharmaService';

export const GET_LOAN_ISSUED = 'GET_LOAN_ISSUED';
export const GET_LOAN_ISSUED_SUCCESS = 'GET_LOAN_ISSUED_SUCCESS';
export const GET_LOAN_ISSUED_FAIL = 'GET_LOAN_ISSUED_FAIL';

const getIssuedLoansStart = () => ({
    type: GET_LOAN_ISSUED
});

const getIssuedLoansSuccess = (loans) => ({
    type: GET_LOAN_ISSUED_SUCCESS,
    loans
});

const getIssuedLoansFail = (error) => ({
    type: GET_LOAN_ISSUED_FAIL,
    error
});

export function getIssuedLoans() {
    return dispatch => {
        dispatch(getIssuedLoansStart());

        return debtsApi.getAll(loanStatuses.FILLED)
            .then(async (debts) => {
                var res = []
                for (let i = 0; i < debts.length; i++) {
                    var debtOrder = await fromDebtOrder(debts[i]);
                    if (debtOrder) {
                        debts[i].dharmaDebtOrder = debtOrder
                        res.push(debts[i])
                    }
                }
                dispatch(getIssuedLoansSuccess(res));
            })
            .catch(err => {
                dispatch(getIssuedLoansFail(err))
            });
    }
}