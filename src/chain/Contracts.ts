import { shallowReactive } from 'vue';

import type BoxContract from './contracts/box';
import type BriqContract from './contracts/briq';
import type SetContract from './contracts/set';
import type AuctionContract from './contracts/auction';
import type ERC20Contract from './contracts/erc20';
import type OnchainAuctionContract from './contracts/auction_onchain';
import type BriqFactoryContract from './contracts/briq_factory';

import type { CHAIN_NETWORKS } from './Network';
import { APP_ENV } from '@/Meta';

export const ADDRESSES: Record<CHAIN_NETWORKS, Record<string, string>> = {
    localhost: {},
    'starknet-testnet': {},
    'starknet-mainnet': {
        briq: '0x00247444a11a98ee7896f9dec18020808249e8aad21662f2fa00402933dce402',
        set: '0x01435498bf393da86b4733b9264a86b58a42b31f8d8b8ba309593e5c17847672',
        box: '0x01e1f972637ad02e0eed03b69304344c4253804e528e1a5dd5c26bb2f23a8139',
        booklet: '0x05faa82e2aec811d3a3b14c1f32e9bbb6c9b4fd0cd6b29a823c98c7360019aa4',
        auction: '0x01712e3e3f133b26d65a3c5aaae78e7405dfca0a3cfe725dd57c4941d9474620',
        auction_ducks: '0x00b9bb7650a88f7e375ae8d31d48b4d4f13c6c34344839837d7dae7ffcdd3df0',
        eth_bridge_contract: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        briq_factory: '0x05b021b6743c4f420e20786baa7fb9add1d711302c267afbc171252a74687376',
    },
};

if (APP_ENV !== 'prod') {
    ADDRESSES['localhost'] = {
        briq: '0x020b2a2baa5f0c679ba7647ed803e975bb6badfe9334b5944a547ac12ef4c099',
        set: '0x03ab0330cff177e3f154cc143b46e9ddac39041ba8ce201def9e3ca8e2aa921a',
        auction: '0x05dd2d089793684e837e01dc136503721f5915af46b8096a7363bb9dbd44901c',
        eth_bridge_contract: '0x62230ea046a9a5fbc261ac77d03c8d41e5d442db2284587570ab46455fd2488',
    };
    ADDRESSES['starknet-testnet'] = {
        briq: '0x0068eb19445f96b3c3775fba757de89ee8f44fda42dc08173a501acacd97853f',
        set: '0x038bf557306ab58c7e2099036b00538b51b37bdad3b8abc31220001fb5139365',
        box: '0x043bafcb15f12c137229406f96735eba51018fe75e5330058479556bc77dfd94',
        booklet: '0x018734a90e5df97235c0ff83f92174cf6f16ad3ec572e38e2e146e47c8878839',
        auction: '0x033f840d4f7bfa20aaa128e5a69157355478d33182bea6039d55aae3ffb861e2',
        auction_ducks: '0x04ef0bd475fb101cc1b5dc2c4fc9d11b4fa233cfa1876924ec84b2f3dcf32f75',
        eth_bridge_contract: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        briq_factory: '0x07ad96c0f03a1924ede9ce2e3e4546560602dcce65b5fd050870cfecf583b414',
    };
    ADDRESSES['starknet-testnet-dojo'] = {
        world: '0x2bef66bac33c7c8a668049a870b9795a468800ec54e398d592fd84f831ae2c',
        executor: '0x1c24cd47ab41ad1140f624ed133db38411bfa44d7f34e41551af819da9a78eb',
        briq_factory: '0x0213556a61d17f369eddf0b531b25f8deb7e5ceaac9263fa00e35a9d3de64b90',
        briq: '0x251cd76d4f31f1c0a1a719a315d524a6338697120e5bede50bc7949819c93e5',
        set: '0x43045108736ec538ac6a4f57ea6da423ad18787eb2da8c7d644a91b4ebd5cc4',
        box: '',
        booklet: '',
        auction: '',
        eth_bridge_contract: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    };
}

const contractStore = shallowReactive({
    briq: undefined as undefined | BriqContract,
    set: undefined as undefined | SetContract,
    box: undefined as undefined | BoxContract,
    auction: undefined as undefined | AuctionContract,
    auction_ducks: undefined as undefined | OnchainAuctionContract,
    eth_bridge_contract: undefined as undefined | ERC20Contract,
    briq_factory: undefined as undefined | BriqFactoryContract,
});

export default contractStore;
