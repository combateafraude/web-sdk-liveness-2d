# **`CafFaces2dSdk`**

This is a quick implementation guide for the `CafFaces2dSdk`.

Create a demo environment for the `CafFaces2dSdk` by cloning this repository.

To obtain a token, follow the instructions here:
[https://docs.caf.io/caf-sdk/sdk\_integration\_documentation](https://docs.caf.io/caf-sdk/sdk_integration_documentation)

> ⚠️ **Important:** To use `CafFaces2dSdk`, a prior configuration is required by the CAF team.
> Please contact support to ensure the token is properly configured and enabled for use with this SDK.

---

## **📦 SDK Reference via `<script>` in `html`**

```html
<script src="./caf-faces2d-sdk.js"></script>
```

---

## **🚀 Initialization**

### **`new CafFaces2dSdk(options: CameraSdkOptions): CafFaces2dSdk`**

Creates an instance of the 2D liveness SDK.

#### **Parameters**

| Name      | Type               | Required | Description                               |
| :-------- | :----------------- | :------- | :---------------------------------------- |
| `options` | `CameraSdkOptions` | ✅        | Configuration object for the SDK instance |

#### **Example**

```ts
const { CafFaces2dSdk } = window['@caf/web-sdk-liveness-2d'];
const sdk = new CafFaces2dSdk({
    token: "my-token",
    personId: "my-person-id",
    environment: "prod",
    useFaceAuthenticator: true,
    language: "en_US",
    disableDesktopExecution: false,
    disableVisibilityChangeSecurity: true,
    analytics: {
        enabled: true,
        trackingId: undefined,
        trackingInfo: undefined,
        enableDebugMode: true,
    },
    appearance: {
        captureButtonIcon: "",
        captureIconSize: "",
        captureButtonColor: "",
        fontFamily: "",
        hideCameraSwitchButton: false,
    },
    textSettings: {
        title: "",
        messages: {
            processMessage: "",
            captureFailedMessage: "",
        },
    },
});
```

### **`CameraSdkOptions`**

SDK initialization parameters.

| Property                          | Type                  | Required | Description                                                                    |
| :-------------------------------- | :-------------------- | :------- | :----------------------------------------------------------------------------- |
| `token`                           | `string`              | ✅        | User authentication token                                                      |
| `personId`                        | `string`              | ✅        | Person identifier                                                              |
| `useFaceAuthenticator`            | `boolean`             | ❌        | Enables facial authentication if `true`. *(default: `false`)*                  |
| `environment`                     | `"dev" "beta" "prod"` | ❌        | Execution environment. *(default: `"prod"`)*                                   |
| `language`                        | `string`              | ❌        | Language code ("en\_US", "pt\_BR", "es\_MX")                                   |
| `disableDesktopExecution`         | `boolean`             | ❌        | Prevents execution on desktop devices *(default: `false`)*                     |
| `disableVisibilityChangeSecurity` | `boolean`             | ✅        | Prevents the SDK from closing when switching browser tabs *(default: `false`)* |
| `disabledSecurityModule`          | `boolean`             | ❌        | Disables image injection protection *(default: `false`)*                       |
| `analytics`                       | `AnalyticsOptions`    | ❌        | Tracking and debugging configuration                                           |
| `appearance`                      | `AppearanceOptions`   | ❌        | Visual customization of the SDK                                                |
| `textSettings`                    | `TextSettings`        | ❌        | Text and messages shown in the UI                                              |

---

### **`AppearanceOptions`**

| Property                 | Type      | Description                                         |
| :----------------------- | :-------- | :-------------------------------------------------- |
| `captureButtonIcon`      | `string`  | Capture button icon (URL or base64 SVG)             |
| `captureIconSize`        | `string`  | Icon size (e.g., `"40px"`). *(default: `"100%"`)*   |
| `captureButtonColor`     | `string`  | Capture button color *(default: `"#39c560"`)*       |
| `fontFamily`             | `string`  | Font applied to the entire UI                       |
| `hideCameraSwitchButton` | `boolean` | Hides the camera switch button *(default: `false`)* |

---

### **`AnalyticsOptions`**

| Property          | Type                     | Description                                   |
| :---------------- | :----------------------- | :-------------------------------------------- |
| `enabled`         | `boolean`                | Enables/disables tracking *(default: `true`)* |
| `trackingId`      | `string`                 | Tracking ID used in the analytics system      |
| `trackingInfo`    | `{ [key: string]: any }` | Extra data added to analytics events          |
| `enableDebugMode` | `boolean`                | Enables detailed logs *(default: `false`)*    |

---

### **`TextSettings`**

| Property   | Type       | Description                            |
| :--------- | :--------- | :------------------------------------- |
| `title`    | `string`   | Title displayed in the UI              |
| `messages` | `Messages` | Messages shown during the capture flow |

---

## **⚙️ Methods**

### **`isSupported(): boolean`**

Checks if the current browser supports the SDK.

```ts
if (sdk.isSupported()) {
  // OK to proceed
}
```

---

### **`initPermissions(): Promise<boolean>`**

Requests the necessary permissions (such as camera access).

```ts
const granted = await sdk.initPermissions();
if (!granted) {
  console.error("Permissions denied.");
}
```

---

### **`initialize(): Promise<void>`**

Initializes the SDK.

```ts
await sdk.initialize();
```

---

### **`capture(sdkDisplayer, stages, params?): Promise<ResponseTransactions>`**

Executes the face capture process.

#### **Parameters**

| Name           | Type             | Description                                             |
| :------------- | :--------------- | :------------------------------------------------------ |
| `sdkDisplayer` | `HTMLElement`    | HTML element where the SDK will be rendered             |
| `stages`       | `CaptureStage[]` | Capture stages with duration and attempt configurations |
| `params?`      | `CaptureOptions` | Additional capture configurations                       |

#### **Example**

```ts
const container = document.getElementById("sdk-container");
const result = await sdk.capture(container, [
  { mode: "automatic", attempts: 3, duration: 20 },
  { mode: "manual", attempts: 0, duration: 0 },
]);
```

### **`CaptureStage`**

| Property   | Type          | Description                                                    |
| :--------- | :------------ | :------------------------------------------------------------- |
| `mode`     | `CaptureMode` | Capture mode (`"automatic"` or `"manual"`)                     |
| `duration` | `number`      | Duration of the stage in seconds. `0` means unlimited duration |
| `attempts` | `number`      | Number of allowed attempts. `0` means unlimited attempts       |


### **📦 `capture` Return**

The `capture` method returns a signed JWT (`signedResponse`) that contains the following decoded data:
(Note: the return is a string; you must decode the JWT manually)

```json
{
  "sessionId": "string",
  "personId": "string",
  "isAlive": boolean,
  "imageUrl": "string",
  "createdAt": "ISO8601 string",
  "iat": number
}
```

| Field       | Type      | Description                                   |
| :---------- | :-------- | :-------------------------------------------- |
| `sessionId` | `string`  | Session identifier                            |
| `personId`  | `string`  | Unique identifier of the person               |
| `isAlive`   | `boolean` | Indicates if the person was detected as alive |
| `imageUrl`  | `string`  | Captured image URL                            |
| `createdAt` | `string`  | Creation timestamp (ISO8601 format)           |
| `iat`       | `number`  | UNIX timestamp of token issuance              |

---

### **`close(): Promise<void>`**

Closes the SDK and hides the UI.

```ts
await sdk.close();
```

---

### **`dispose(): Promise<void>`**

Releases resources used by the SDK.

```ts
await sdk.dispose();
```

---

## **🔁 Lifecycle**

1. **Initialize SDK:**
   `sdk.initPermissions()` → `sdk.initialize()`

2. **Run Capture:**
   `sdk.capture(container, stages)`

3. **Close SDK:**
   `sdk.close()` → `sdk.dispose()`

---

_This project is a reference integration of Caf's proprietary SDK for Liveness. All rights to the SDKs belong to Caf._
