import contract from 'truffle-contract';
import BigNumber from 'bignumber.js';
import { abi as TOKEN_ABI } from '../tokenJson/token_abi.json';
import web3Provider from './web3Service.js';
import * as dharmaService from './dharmaService.js';

const supportedTokensPromise = dharmaService.getSupportedTokens();
const cachedTokens = {};

export async function convertToHumanReadable(amount, tokenSymbol) {
    const decimals = await getTokenDecimals(tokenSymbol);
    const res = new BigNumber(amount || 0).mul('1e-' + decimals.toNumber())
    return res;
}

export async function convertFromHumanReadable(amount, tokenSymbol) {
    const decimals = await getTokenDecimals(tokenSymbol);
    const res = new BigNumber(amount || 0).mul('1e' + decimals.toNumber())
    return res;
}

export async function getTokenAddressBySymbolAsync(symbol) {
    const contract = await getTokenContractBySymbolAsync(symbol)
    return contract.address;
}

export async function getTokenNameBySymbolAsync(symbol) {
    const contract = await getTokenContractBySymbolAsync(symbol)
    return contract.name();
}

export async function getTokenBalanceAsync(symbol, ownerAddress) {
    let contract = await getTokenContractBySymbolAsync(symbol);
    let balance = await contract.balanceOf(ownerAddress);
    return convertToHumanReadable(balance, symbol);
}

export async function unlockTokenAsync(symbol, unlock) {
    const tokenAddress = await getTokenAddressBySymbolAsync(symbol)
    console.log('unlockTokenAsync called:', symbol, unlock)
    if (unlock) {
        await dharmaService.setUnlimitedProxyAllowanceAsync(tokenAddress);
    } else {
        await dharmaService.setProxyAllowanceAsync(tokenAddress, 0);
    }
}

export async function getTokenLockAsync(symbol) {
    const tokenAddress = await getTokenAddressBySymbolAsync(symbol)
    const allowance = await dharmaService.getProxyAllowanceAsync(tokenAddress)

    return allowance.greaterThan(0)
}

export async function unlockCollateralTokenAsync(symbol, unlock) {
    const tokenAddress = await getTokenAddressBySymbolAsync(symbol)
    console.log('unlockCollateralTokenAsync called:', symbol, unlock);
    return new Promise((resolve, reject) => {
        resolve();
    });
}

export async function getTokenContractBySymbolAsync(symbol) {
    if (symbol in (await supportedTokensPromise)) {
        if (!(symbol in cachedTokens)) {
            const TokenContract = contract({
                abi: TOKEN_ABI
            });
            TokenContract.setProvider(web3Provider);
            cachedTokens[symbol] = TokenContract.at((await supportedTokensPromise)[symbol]);
        }

        return cachedTokens[symbol];
    }
    return null;
}

async function getTokenDecimals(symbol) {
    const token = await getTokenContractBySymbolAsync(symbol);

    return token.decimals();
}