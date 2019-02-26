import React, { Component } from 'react';
import { calculateNumberOfPayments, calculateRepaymentAmount, calculateTotalPaymentAmount, isFloat } from '../../common/services/utilities';
import Confirm from '../confirm/confirm';
import './step-unlock-tokens.css';
import Slider from '../slider/slider.js';

class StepUnlockTokens extends Component {

    onToggleChange(e) {
        let unlockValue = e.target.checked;
        let { collateralType, unlockCollateralToken } = this.props;
        unlockCollateralToken(collateralType, unlockValue);
    }

    render() {
        let { onConfirm, onCancel, collateralTokenUnlocked, unlockInProgress } = this.props;

        return (
            <div className="unlock-tokens">
                <Confirm
                    header="Unlock tokens"
                    confirmText="NEXT"
                    confirmDisabled={!collateralTokenUnlocked}
                    cancelText="CANCEL"
                    onConfirm={() => onConfirm()}
                    onCancel={onCancel}>

                    <ul className="unlock-tokens__list">
                        <li>Borrowers who provide collateral are required to give smart contracts permission to transfer tokens when debt order is filled.</li>
                        <li>Borrowers have to unlock their tokens to allow use of collateral. To unlock your tokens click the toggle below.</li>
                    </ul>

                    <div className="unlock-tokens__toggle-row">
                        <div className="unlock-tokens__toggle-wrapper">
                            <Slider on={collateralTokenUnlocked} onChange={this.onToggleChange.bind(this)} loading={unlockInProgress} />
                        </div>
                        <div className="unlock-tokens__toggle-label">
                            Toggle to UNLOCK token type used in collateral.
            </div>
                    </div>

                </Confirm>
            </div>
        );
    }
}


export default StepUnlockTokens;