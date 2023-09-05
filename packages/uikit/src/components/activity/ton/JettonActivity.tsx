import { Action } from '@tonkeeper/core/dist/tonApiV2';
import { formatAddress, toShortValue } from '@tonkeeper/core/dist/utils/common';
import React, { FC } from 'react';
import { useWalletContext } from '../../../hooks/appContext';
import { useFormatCoinValue } from '../../../hooks/balance';
import { useTranslation } from '../../../hooks/translation';
import { SendIcon } from '../../home/HomeIcons';
import { FailedNote } from '../ActivityActionLayout';
import { ActivityIcon, ReceiveIcon, SwapIcon } from '../ActivityIcons';
import {
    AmountText,
    ColumnLayout,
    Description,
    ErrorAction,
    FirstLabel,
    FirstLine,
    ListItemGrid,
    SecondLine,
    SecondaryText
} from '../CommonAction';
import { toDexName } from '../NotificationCommon';

export interface JettonActionProps {
    action: Action;
    date: string;
}

export const JettonSwapAction: FC<JettonActionProps> = ({ action, date }) => {
    const { t } = useTranslation();
    const { jettonSwap } = action;
    const format = useFormatCoinValue();

    if (!jettonSwap) {
        return <ErrorAction />;
    }

    return (
        <ListItemGrid>
            <ActivityIcon status={action.status}>
                <SwapIcon />
            </ActivityIcon>
            <Description>
                <FirstLine>
                    <FirstLabel>{t('swap_title')}</FirstLabel>
                    <AmountText green>
                        +&thinsp;{format(jettonSwap.amountOut, jettonSwap.jettonMasterOut.decimals)}
                    </AmountText>
                    <AmountText green>{jettonSwap.jettonMasterOut.symbol}</AmountText>
                </FirstLine>
                <FirstLine>
                    <SecondaryText>{toDexName(jettonSwap.dex)}</SecondaryText>
                    <AmountText>
                        -&thinsp;{format(jettonSwap.amountIn, jettonSwap.jettonMasterIn.decimals)}
                    </AmountText>
                    <AmountText>{jettonSwap.jettonMasterIn.symbol}</AmountText>
                </FirstLine>
                <SecondLine>
                    <SecondaryText></SecondaryText>
                    <SecondaryText>{date}</SecondaryText>
                </SecondLine>
            </Description>
            <FailedNote status={action.status} />
        </ListItemGrid>
    );
};

export const JettonBurnAction: FC<JettonActionProps> = ({ action, date }) => {
    const { t } = useTranslation();
    const { jettonBurn } = action;
    const format = useFormatCoinValue();
    const wallet = useWalletContext();

    if (!jettonBurn) {
        return <ErrorAction />;
    }
    return (
        <ListItemGrid>
            <ActivityIcon status={action.status}>
                <SendIcon />
            </ActivityIcon>
            <ColumnLayout
                title={t('transaction_type_burn')}
                amount={<>-&thinsp;{format(jettonBurn.amount, jettonBurn.jetton.decimals)}</>}
                entry={jettonBurn.jetton.symbol}
                address={toShortValue(formatAddress(jettonBurn.jetton.address, wallet.network))}
                date={date}
            />
        </ListItemGrid>
    );
};

export const JettonMintAction: FC<JettonActionProps> = ({ action, date }) => {
    const { t } = useTranslation();
    const { jettonMint } = action;
    const format = useFormatCoinValue();
    const wallet = useWalletContext();

    if (!jettonMint) {
        return <ErrorAction />;
    }
    return (
        <ListItemGrid>
            <ActivityIcon status={action.status}>
                <ReceiveIcon />
            </ActivityIcon>
            <ColumnLayout
                title={t('transaction_type_mint')}
                amount={<>+&thinsp;{format(jettonMint.amount, jettonMint.jetton.decimals)}</>}
                entry={jettonMint.jetton.symbol}
                address={toShortValue(formatAddress(jettonMint.jetton.address, wallet.network))}
                date={date}
                green
            />
        </ListItemGrid>
    );
};