import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendNftTransfer } from '@tonkeeper/core/dist/service/transfer/nftService';
import { NftItem } from '@tonkeeper/core/dist/tonApiV2';
import { formatAddress, toShortValue } from '@tonkeeper/core/dist/utils/common';
import React, { FC, useState } from 'react';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useAppSdk } from '../../hooks/appSdk';
import { useTranslation } from '../../hooks/translation';
import { getWalletPassword } from '../../state/password';
import { CheckmarkCircleIcon, ChevronLeftIcon, ExclamationMarkCircleIcon } from '../Icon';
import { Gap } from '../Layout';
import { ListBlock, ListItem, ListItemPayload } from '../List';
import { FullHeightBlock, NotificationCancelButton, NotificationTitleBlock } from '../Notification';
import { Label1, Label2 } from '../Text';
import { TransferComment } from '../activity/ActivityDetailsLayout';
import { ActionFeeDetails } from '../activity/NotificationCommon';
import { BackButton } from '../fields/BackButton';
import { Button } from '../fields/Button';
import { ButtonBlock, Label, ResultButton, notifyError } from './common';

import { TonRecipientData } from '@tonkeeper/core/dist/entries/send';
import { MessageConsequences } from '@tonkeeper/core/dist/tonApiV2';
import { useTransactionAnalytics } from '../../hooks/amplitude';
import { Image, ImageMock, Info, SendingTitle, Title } from './Confirm';
import { RecipientListItem } from './ConfirmListItem';

const useSendNft = (recipient: TonRecipientData, nftItem: NftItem, fee?: MessageConsequences) => {
    const { t } = useTranslation();
    const sdk = useAppSdk();
    const { api } = useAppContext();
    const wallet = useWalletContext();
    const client = useQueryClient();
    const track2 = useTransactionAnalytics();

    return useMutation<boolean, Error>(async () => {
        if (!fee) return false;
        const password = await getWalletPassword(sdk, 'confirm').catch(() => null);
        if (password === null) return false;

        track2('send-nft');
        try {
            await sendNftTransfer(sdk.storage, api, wallet, recipient, nftItem, fee, password);
        } catch (e) {
            await notifyError(client, sdk, t, e);
        }

        await client.invalidateQueries([wallet.active.rawAddress]);
        await client.invalidateQueries();
        return true;
    });
};

export const ConfirmNftView: FC<{
    recipient: TonRecipientData;
    nftItem: NftItem;
    fee?: MessageConsequences;
    onBack: () => void;
    onClose: () => void;
}> = ({ recipient, onBack, onClose, nftItem, fee }) => {
    const { standalone } = useAppContext();
    const [done, setDone] = useState(false);
    const { t } = useTranslation();
    const sdk = useAppSdk();
    const wallet = useWalletContext();

    const { mutateAsync, isLoading, error, reset } = useSendNft(recipient, nftItem, fee);

    const isValid = !isLoading;

    const image = nftItem.previews?.find(item => item.resolution === '100x100');

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
        e.stopPropagation();
        e.preventDefault();

        if (isLoading) return;
        try {
            reset();
            const isDone = await mutateAsync();
            if (isDone) {
                setDone(true);
                setTimeout(onClose, 2000);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <FullHeightBlock onSubmit={onSubmit} standalone={standalone}>
            <NotificationTitleBlock>
                <BackButton onClick={onBack}>
                    <ChevronLeftIcon />
                </BackButton>
                <NotificationCancelButton handleClose={onClose} />
            </NotificationTitleBlock>
            <Info>
                {image ? <Image src={image.url} /> : <ImageMock />}
                <SendingTitle>{nftItem.dns ?? nftItem.metadata.name}</SendingTitle>
                <Title>{t('txActions_signRaw_types_nftItemTransfer')}</Title>
            </Info>
            <ListBlock margin={false} fullWidth>
                <RecipientListItem recipient={recipient} />
                {fee && <ActionFeeDetails fee={fee} />}
                <TransferComment comment={recipient.comment} />
            </ListBlock>

            <ListBlock fullWidth>
                {nftItem.collection && (
                    <ListItem
                        onClick={() =>
                            sdk.copyToClipboard(
                                formatAddress(nftItem.collection!.address, wallet.network, true)
                            )
                        }
                    >
                        <ListItemPayload>
                            <Label>{t('NFT_collection_id')}</Label>
                            <Label1>
                                {toShortValue(
                                    formatAddress(nftItem.collection!.address, wallet.network, true)
                                )}
                            </Label1>
                        </ListItemPayload>
                    </ListItem>
                )}
                <ListItem
                    onClick={() =>
                        sdk.copyToClipboard(formatAddress(nftItem.address, wallet.network, true))
                    }
                >
                    <ListItemPayload>
                        <Label>{t('NFT_item_id')}</Label>
                        <Label1>
                            {toShortValue(formatAddress(nftItem.address, wallet.network, true))}
                        </Label1>
                    </ListItemPayload>
                </ListItem>
            </ListBlock>
            <Gap />

            <ButtonBlock>
                {done && (
                    <ResultButton done>
                        <CheckmarkCircleIcon />
                        <Label2>{t('send_screen_steps_done_done_label')}</Label2>
                    </ResultButton>
                )}
                {error && (
                    <ResultButton>
                        <ExclamationMarkCircleIcon />
                        <Label2>{t('send_publish_tx_error')}</Label2>
                    </ResultButton>
                )}
                {!done && !error && (
                    <Button
                        fullWidth
                        size="large"
                        primary
                        type="submit"
                        disabled={!isValid}
                        loading={isLoading || fee === undefined}
                    >
                        {t('confirm_sending_submit')}
                    </Button>
                )}
            </ButtonBlock>
        </FullHeightBlock>
    );
};
