const { CafFaces2dSdk } = window['@caf/web-sdk-liveness-2d'];

const sdkContainer = document.getElementById('livenessSdkContainer');
const loaderContainer = document.getElementById('loader-container');
const buttonSdkInit = document.getElementById('initializeButton');
const buttonSdkCapture = document.getElementById('captureButton');
const buttonSdkClose = document.getElementById('closeButton');

buttonSdkInit.disabled = false;
buttonSdkInit.addEventListener('click', initSdk);
buttonSdkCapture.disabled = true;
buttonSdkCapture.addEventListener('click', runSdk);
buttonSdkClose.disabled = true;
buttonSdkClose.addEventListener('click', closeDisposeSDK);

function showLoader() {
  loaderContainer.style.display = 'block';
}

function hideLoader() {
  loaderContainer.style.display = 'none';
}

const sdk = new CafFaces2dSdk({
  token: 'INSERT_YOUR_TOKEN_HERE',
  personId: 'INSERT_YOUR_PERSON_ID_HERE',
  environment: "beta",
  useFaceAuthenticator: false,
  language: 'en_US',
  disableDesktopExecution: false,
  disableVisibilityChangeSecurity: true,
  analytics: {
    enabled: false,
    trackingId: undefined,
    trackingInfo: undefined,
    enableDebugMode: true,
  },
  appearance: {
    captureButtonIcon: '',
    captureIconSize: '',
    captureButtonColor: '',
    fontFamily: '',
    hideCameraSwitchButton: false,
  },
  textSettings: {
    title: '',
    messages: {
      processMessage: '',
      captureFailedMessage: '',
    },
  },
});

async function initSdk() {
  showLoader();
  buttonSdkInit.textContent = 'Initializing...';
  buttonSdkInit.disabled = true;

  try {
    await sdk.initPermissions();
    await sdk.initialize();
    buttonSdkCapture.disabled = false;
    buttonSdkClose.disabled = false;
  } catch (error) {
    console.error("[Playground] Error initializing SDK", error);
    buttonSdkInit.disabled = false;
  }

  buttonSdkInit.textContent = 'Initialize SDK';
  hideLoader();
}

async function runSdk() {
  showLoader();
  buttonSdkCapture.textContent = 'Executing capture...';
  buttonSdkCapture.disabled = true;

  try {
    const stages = [{ mode: 'manual', attempts: 0, duration: 0 }];
    const result = await sdk.capture(sdkContainer, stages, {
      onCaptureProcessingStart: () => {
        console.log('[Playground] Capture processing started');
        buttonSdkClose.disabled = true;
      },
      onCaptureProcessingEnd: (isFinalCapture) => {
        console.log('[Playground] Capture processing finished', isFinalCapture);
        buttonSdkClose.disabled = false;
      },
    });
    console.log('[Playground] Capture finished', result);
    buttonSdkClose.disabled = false;
  } catch (error) {
    console.error("[Playground] Error running SDK", error);
    buttonSdkCapture.disabled = false;
  }

  buttonSdkCapture.textContent = 'Execute capture';
  hideLoader();
}

async function closeDisposeSDK() {
  showLoader();
  buttonSdkClose.textContent = 'Closing...';
  buttonSdkClose.disabled = true;

  try {
    await sdk.close();
    await sdk.dispose();
    buttonSdkInit.disabled = false;
    buttonSdkCapture.disabled = true;
  } catch (error) {
    console.error("[Playground] Error closing SDK", error);
    buttonSdkClose.disabled = false;
  }

  buttonSdkClose.textContent = 'Close SDK';
  buttonSdkCapture.textContent = 'Execute capture';
  hideLoader();
}
