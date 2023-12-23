export const ETH_PV_KEY_REGEX: RegExp = /^(0x)?[0-9a-fA-F]{64}$/;
export const ETH_ADDRESS_REGEX: RegExp = /^(0x)?[0-9a-fA-F]{40}$/;
export const PGP_KEY_REGEX: RegExp =
    /^(-----BEGIN PGP PUBLIC KEY BLOCK-----).*([a-zA-Z0-9//\n/.:+ =]+).*(-----END PGP PUBLIC KEY BLOCK-----)$|^(-----BEGIN PGP PRIVATE KEY BLOCK-----).*([a-zA-Z0-9//\n/.:+ =]+).*(-----END PGP PRIVATE KEY BLOCK-----)$/;

export const PV_KEY_FOUND: string = "[+] Private Key found";
export const ADDRESS_FOUND: string = "[+] Address found";
export const PGP_KEY_FOUND: string = "[+] PGP Key found";

export const NOT_FOUND_MSG: string = "No Private Keys found!";

// LABELS
export const FOUND_LABEL_MESSAGE: string = "vulnerable";
export const FOUND_LABEL_COLOR: string = "ff0000";
export const NOT_FOUND_LABEL_MESSAGE: string = "secure";
export const NOT_FOUND_LABEL_COLOR: string = "0038ff";

// EVENTS
export const EVENTS: any[] = [
    "pull_request.opened",
    "pull_request.reopened",
    "pull_request.edited",
    "pull_request.synchronize",
];
