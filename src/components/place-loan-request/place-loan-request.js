import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm, formValueSelector, change as changeForm } from 'redux-form';
import './place-loan-request.css';
import {allowCollateral, placeLoanRequest, resetLoanForm} from '../../actions';
import * as CurrencyCodes from '../../common/currencyCodes';

const amortizationValues = {
  end: 'End Of Loan Term',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly'
};

const termValues = {
  1: {name: '1 day', amortizationFrequencies: [amortizationValues.end]},
  7: {name: '7 days', amortizationFrequencies: [amortizationValues.daily, amortizationValues.end]},
  30: {name: '30 days', amortizationFrequencies: [amortizationValues.weekly, amortizationValues.end]},
  90: {name: '90 days', amortizationFrequencies: [amortizationValues.monthly, amortizationValues.end]},
  180: {name: '180 days', amortizationFrequencies: [amortizationValues.monthly, amortizationValues.end]},
  360: {name: '360 days', amortizationFrequencies: [amortizationValues.monthly, amortizationValues.end]}
};

const floatOnly = (value) => {
  if (value === null || value === '' || value === undefined) { return '' }
  let v = value.toString().replace(/[^\d.]/g, '')
  v = v.slice(0, v.indexOf('.') >= 0 ? v.indexOf('.') + 6 : undefined)
  return v
};
const required = value => (value ? false : true);

class PlaceLoanRequest extends Component{

  constructor(props){
    super(props);
    this.resetForm = this.resetForm.bind(this);
  }

  allowCollateralUseClick({amount, collateralType}){
    this.props.allowCollateral(1.5 * amount, collateralType);
  }

  placeLoanRequestClick(values){
    //if(!this.props.collateralAllowed){
    //  alert('You should Allow Collateral use');
    //  return;
    //}
    let {placeLoanRequest, term} = this.props;
    placeLoanRequest({
      ...values,
      amortizationFrequency: values.amortizationFrequency || termValues[term].amortizationFrequencies[0]
    }, this.resetForm);
  }

  resetForm(){
    this.props.reset();
    this.props.resetLoanForm();
  }

  renderAmortizationFrequencySelect(selectedTerm){
    return (
      <Field name="amortizationFrequency" className="loan-request-form__select" component="select">
        {
          termValues[selectedTerm].amortizationFrequencies.map(freq => {
            return (<option key={freq} value={freq}>{freq}</option>);
          })
        }
      </Field>
    );
  }

  termChange(event, newValue){
    let newSelectedFrequency = termValues[newValue].amortizationFrequencies[0];
    this.props.changeAmortizationFrequency(newSelectedFrequency);
  }

  render(){
    const { handleSubmit, valid, collateralAllowed, term } = this.props;

    return (
      <div className="loan-request-form">
        <div className="loan-request-form__row">
          <div className="loan-request-form__input-wrapper">
            <Field
              name="amount"
              className="loan-request-form__input"
              placeholder="Amount"
              component="input"
              validate={required}
              normalize={floatOnly}/>
          </div>
          <div className="loan-request-form__select-wrapper">
            <Field name="currency" className="loan-request-form__select" component="select">
              <option value={CurrencyCodes.DAI}>{CurrencyCodes.DAI}</option>
              <option value={CurrencyCodes.REP}>{CurrencyCodes.REP}</option>
              <option value={CurrencyCodes.MKR}>{CurrencyCodes.MKR}</option>
              <option value={CurrencyCodes.ZRX}>{CurrencyCodes.ZRX}</option>
            </Field>
          </div>
        </div>
        <div className="loan-request-form__row">
          <div className="loan-request-form__label-wrapper">
            Term
          </div>
          <div className="loan-request-form__select-wrapper">
            <Field name="term" className="loan-request-form__select" component="select" onChange={this.termChange.bind(this)}>
              <option value="1">{termValues['1'].name}</option>
              <option value="7">{termValues['7'].name}</option>
              <option value="30">{termValues['30'].name}</option>
              <option value="90">{termValues['90'].name}</option>
              <option value="180">{termValues['180'].name}</option>
              <option value="360">{termValues['360'].name}</option>
            </Field>
          </div>
        </div>
        <div className="loan-request-form__repayment-frequency">
          <span>Repayment frequency</span>
        </div>
        <div className="loan-request-form__row">
          <div className="loan-request-form__label-wrapper">
            {term ? termValues[term].name : termValues['30'].name} loan
          </div>
          <div className="loan-request-form__select-wrapper">
            {term && this.renderAmortizationFrequencySelect(term)}
          </div>
        </div>
        <div className="loan-request-form__row">
          <div className="loan-request-form__input-wrapper">
            <Field
              name="maxInterest"
              className="loan-request-form__input"
              placeholder="Max interest rate (annual)"
              component="input"
              validate={required}
              normalize={floatOnly}/>
          </div>
        </div>
        <div className="loan-request-form__row">
          <div className="loan-request-form__label-wrapper">
            Collateral type
          </div>
          <div className="loan-request-form__select-wrapper">
            <Field name="collateralType" className="loan-request-form__select" component="select">
              <option value={CurrencyCodes.DAI}>{CurrencyCodes.DAI}</option>
              <option value={CurrencyCodes.REP}>{CurrencyCodes.REP}</option>
              <option value={CurrencyCodes.MKR}>{CurrencyCodes.MKR}</option>
              <option value={CurrencyCodes.ZRX}>{CurrencyCodes.ZRX}</option>
            </Field>
          </div>
        </div>
        <div className="loan-request-form__row">
          <div className="loan-request-form__collateral-input-wrapper">
            <input defaultValue="Collateral value 150%" className="loan-request-form__input"/>
          </div>
          <div className="loan-request-form__collateral-input-wrapper">
            <button
              className={"loan-request-form__collateral-btn " + (valid ? "" : "loan-request-form_disabled")}
              onClick={handleSubmit(this.allowCollateralUseClick.bind(this))}>
              Allow collateral use
            </button>
          </div>
        </div>
        <div className="loan-request-form__relayer-fee">
          <span>Relayer fee 0.00%</span>
        </div>
        <div className="loan-request-form__place-btn-wrapper">
          <button
            className={"loan-request-form__place-btn " + (valid && collateralAllowed ? "" : "loan-request-form_disabled")}
            onClick={handleSubmit(this.placeLoanRequestClick.bind(this))}>
            PLACE LOAN REQUEST
          </button>
        </div>
      </div>
    );
  }
}

const selector = formValueSelector('LoanRequestForm');

let mapStateToProps = state => ({
  amount: selector(state, 'amount'),
  term: selector(state, 'term'),
  amortizationFrequency: selector(state, 'amortizationFrequency'),
  collateralAllowed: state.collateralAllowed
});
let mapDispatchToProps = (dispatch) => ({
  allowCollateral(amount, token){
    dispatch(allowCollateral(amount, token))
  },
  placeLoanRequest(order, callback){
    dispatch(placeLoanRequest(order, callback))
  },
  changeAmortizationFrequency(value){
    dispatch(changeForm('LoanRequestForm', 'amortizationFrequency', value))
  },
  resetLoanForm(){
    dispatch(resetLoanForm());
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'LoanRequestForm',
  initialValues:{
    term: 7,
    currency: CurrencyCodes.DAI,
    collateralType:CurrencyCodes.DAI
  }
})(PlaceLoanRequest));