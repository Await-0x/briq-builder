<script setup lang="ts">
import WebGLCanvas from './WebGLCanvas.vue'
import MenuBar from './MenuBar.vue'
import SideBar from './SideBar.vue'
import SideBarRight from './SideBarRight.vue'
import MiddleModal from '../MiddleModal.vue'
import WalletSelector from '../WalletSelector.vue';
import Messages from '../Messages.vue'
import SplashScreen from './SplashScreen.vue'
</script>

<template>
  <SplashScreen/>
  <div>
    <WebGLCanvas/>
    <MenuBar/>
    <SideBar/>
    <SideBarRight/>
    <Messages/>
    <MiddleModal/>
    <WalletSelector/>
  </div>
</template>

<script lang="ts">

import { pushMessage, setTooltip } from '../../Messages'
export default {
  data() {
    return {
    };
  },
  provide: {
    messages: {
      pushMessage, setTooltip
    },
  },
  created: function() {
  },
  mounted: function() {
  },
  methods: {
  }
};
</script>

<style scoped>
</style>