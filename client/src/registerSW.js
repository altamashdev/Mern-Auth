import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New version available. Refresh now?")) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log("App is ready to work offline.");
  },
});
