import { backendManager } from '@/Backend';
import { maybeStore, walletInitComplete } from '@/chain/WalletLoading';
import { logDebug } from '@/Messages';
import { Notif, notificationsManager } from '@/Notifications';
import { reactive, watchEffect } from 'vue';
import { useGenesisStore } from './GenesisStore';
import { BidNotif } from './BidNotif';
import { hexUuid } from '@/Uuid';

class FailedBidNotif extends Notif {
    type = 'failed_bid';
    item: string;
    value: number;

    constructor(data: any) {
        super(data);
        this.item = data.item;
        this.value = data.value;
    }

    get summary() {
        const genesisStore = useGenesisStore();
        return `Your bid on ${ genesisStore.metadata[this.item]._data?.name || this.item } of ${ this.value } ETH has failed to process`;
    }

    serialize() {
        return {
            item: this.item,
            value: this.value,
        }
    }
}

notificationsManager.register('failed_bid', FailedBidNotif);

interface Bid {
    tx_hash: string,
    block: number,
    status: 'CONFIRMED' | 'TENTATIVE' | 'PENDING';
    item: string,
    value: number,
}

class UserBidStore {
    lastConfirmedBlock = -1;
    bids = [] as Bid[];

    syncBlock() {
        logDebug('SYNCING USER BID BLOCK')
        //backendManager.fetch('v1/bids')
        const bidData = {
            block: 13414,
            bids: {} as { [tx_hash: string]: Bid },
        };
        if (bidData.block <= this.lastConfirmedBlock)
            return;
        for (let i = 0; i < this.bids.length; ++i) {
            const bid = this.bids[i];
            // Can't find the bid and should have been confirmed -> mark it failed.
            const newBidData = bidData.bids[bid.tx_hash];
            if (!newBidData) {
                if (bid.block <= bidData.block) {
                    notificationsManager.push(new FailedBidNotif(bid));
                    this.bids.splice(i, 1);
                    i--;
                }
            } else if (bid.status !== 'CONFIRMED')
                bid.status = 'CONFIRMED';
            newBidData._found = true;
        }
        for (const txHash in bidData.bids)
            if (!bidData.bids[txHash]._found)
                this.bids.push(bidData.bids[txHash]);

        this.lastConfirmedBlock = bidData.block;
    }

    makeBid(value: number, item: string) {
        const tx_hash = hexUuid();
        const newBid = {
            tx_hash,
            value: value,
            item: item,
            status: 'TENTATIVE',
            block: -1,
        } as Bid;
        // The notification will handle its own polling logic.
        new BidNotif(newBid).push();
        this.bids.push(newBid);
        return newBid;
    }
}

export const bidStore = reactive(new class<T> {
    _perWallet = {} as { [wallet: string]: T };
    currentWallet = undefined as undefined | string;

    get current() {
        if (!this.currentWallet)
            return undefined;
        return this._perWallet[this.currentWallet];
    }
    /* Exists solely for the purpose of being called somewhere, so that the import is used & things happen. */
    _setup = false;
    setup() {
        if (this._setup)
            return;
        walletInitComplete.then(() => {
            watchEffect(() => {
                bidStore.currentWallet = maybeStore.value?.userWalletAddress || undefined;
                if (bidStore.currentWallet && !bidStore._perWallet[bidStore.currentWallet])
                    bidStore._perWallet[bidStore.currentWallet] = new UserBidStore();
                bidStore.current?.syncBlock();
            })
        })
        this._setup = true;
    }

}<UserBidStore>)