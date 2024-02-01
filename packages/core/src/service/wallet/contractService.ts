import { beginCell, storeStateInit } from '@ton/core';
import { WalletContractV3R1 } from '@ton/ton/dist/wallets/WalletContractV3R1';
import { WalletContractV3R2 } from '@ton/ton/dist/wallets/WalletContractV3R2';
import { WalletContractV4 } from '@ton/ton/dist/wallets/WalletContractV4';
import { WalletContractV5 } from '@ton/ton/dist/wallets/WalletContractV5';
import { Network } from '../../entries/network';
import { WalletState, WalletVersion } from '../../entries/wallet';

export const walletContractFromState = (wallet: WalletState, network?: Network) => {
    const publicKey = Buffer.from(wallet.publicKey, 'hex');
    return walletContract(publicKey, wallet.active.version, wallet.network);
};

const workchain = 0;

export const walletContract = (
    publicKey: Buffer,
    version: WalletVersion,
    network: Network | undefined
) => {
    switch (version) {
        case WalletVersion.V3R1:
            return WalletContractV3R1.create({ workchain, publicKey });
        case WalletVersion.V3R2:
            return WalletContractV3R2.create({ workchain, publicKey });
        case WalletVersion.V4R1:
            throw new Error('Unsupported wallet contract version - v4R1');
        case WalletVersion.V4R2:
            return WalletContractV4.create({ workchain, publicKey });
        case WalletVersion.W5:
            return WalletContractV5.create({
                walletId: {
                    networkGlobalId: network
                },
                publicKey
            });
    }
};

export const walletStateInitFromState = (wallet: WalletState) => {
    const contract = walletContractFromState(wallet);

    return beginCell()
        .store(storeStateInit(contract.init))
        .endCell()
        .toBoc({ idx: false })
        .toString('base64');
};
