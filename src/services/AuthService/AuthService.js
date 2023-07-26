import { Log, UserManager, WebStorageStateStore } from "oidc-client";
import {
  IDENTITY_CONFIG,
  METADATA_OIDC,
} from "configurations/IdentityConfiguration/IdentityConfiguration";

const userManager = new UserManager({
  ...IDENTITY_CONFIG,
  userStore: new WebStorageStateStore({ store: localStorage }),
  metadata: {
    ...METADATA_OIDC,
  },
});

export default userManager;
