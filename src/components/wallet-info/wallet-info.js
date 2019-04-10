import React, { Component } from 'react';
import './wallet-info.css';
import Spinner from '../spinner/spinner';
import { SUPPORTED_TOKENS } from '../../common/api/config';
import { isFloat } from '../../common/services/utilities';

let destroyTimer = null;

let startTimer = (func) => {
  destroyTimer = setTimeout(() => {
    func();
    startTimer(func);
  }, 5000)
};

class WalletInfo extends Component {
  constructor(props) {
    super(props);

    this.renderCurrencyItems = this.renderCurrencyItems.bind(this);
  }

  componentDidMount() {
    let { getWalletInfo } = this.props;
    getWalletInfo();
    startTimer(getWalletInfo);
  }

  componentWillUnmount() {
    destroyTimer && destroyTimer();
  }

  renderCurrencyItems(selectedCurrency) {
    return ['ETH'].concat(SUPPORTED_TOKENS).map(currency => {
      return (
        <div key={currency} className={"wallet-info__currency" + (selectedCurrency === currency ? " wallet-info__currency_active" : "")}
          onClick={() => { this.props.selectCurrency(currency) }}>
          {currency}
        </div>
      );
    });
  }

  render() {
    let { address, amount, selectedCurrency, isProcessing } = this.props;

    let amountString;
    if (amount) {
      amount = amount.toNumber();
      amountString = isFloat(amount) ? amount.toFixed(2) : amount;
    }

    return (
      <div className="wallet-info">
        <div className="wallet-info__logo">
        </div>
        <div className="wallet-info__address">
          <p>Ethereum address</p>
          <span>
            {address}
          </span>
        </div>
        <div className="wallet-info__balance-info">
          <p>Balance</p>
          <div>
            {isProcessing ? <Spinner></Spinner> :
              <span className="wallet-info__balance" title={`${amountString} ${selectedCurrency}`}>
                <strong>{amountString}</strong> {selectedCurrency}
              </span>
            }
            <div className="wallet-info__currency-container">
              {this.renderCurrencyItems(selectedCurrency)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WalletInfo;