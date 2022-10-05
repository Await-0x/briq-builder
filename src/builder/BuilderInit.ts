import { ref, markRaw, toRef, watchEffect, reactive, computed, readonly, Ref, shallowReadonly, shallowRef } from 'vue';

import { setsManager, checkForInitialGMSet, setupLocalSetWatcher } from '@/builder/SetsManager';
import { watchEffectAndWait } from '@/Async';

import { setupInputMap } from '@/builder/inputs/InputMapPopulate';
import { isLoaded as storeIsLoaded } from '@/store/StoreLoading';
import { store } from '@/store/Store';
import { walletInitComplete } from '@/chain/WalletLoading';
import { logDebug } from '@/Messages';
import { setSync } from './SetSync';

import { builderStore } from './BuilderStore';
import contractStore from '@/chain/Contracts';

const { currentSet, selectSet } = builderStore;

async function initializeChainBackend() {
    logDebug('BUILDER INIT - CHAIN BACKEND');

    const walletStore = await walletInitComplete; // Wait until we've completed wallet init (or failed)
}

async function initializeStartSet() {
    await storeIsLoaded;
    const set = checkForInitialGMSet();
    if (set)
        await selectSet(set);

    // Must have a local set.
    await watchEffectAndWait(async () => {
        if (!currentSet.value) {
            let set = setsManager.getLocalSet();
            if (!set)
                set = setsManager.createLocalSet();
            await selectSet(set);
        }
    });

    logDebug('BUILDER - START SET INITIALIZED');
}

let _setup = false;
export async function initializeBuilder() {
    if (_setup)
        return;
    _setup = true;

    setupInputMap();

    initializeChainBackend();

    await initializeStartSet();

    // Reset history so we start fresh, because at this point other operations have polluted it.
    await store.dispatch('reset_history');
}

