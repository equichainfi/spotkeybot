export const ETH_PV_KEY_REGEX: RegExp = /^(0x)?[0-9a-fA-F]{64}$/;
export const ETH_ADDRESS_REGEX: RegExp = /^(0x)?[0-9a-fA-F]{40}$/;
export const PGP_KEY_REGEX: RegExp =
    /^(-----BEGIN PGP PUBLIC KEY BLOCK-----).*([a-zA-Z0-9//\n/.:+ =]+).*(-----END PGP PUBLIC KEY BLOCK-----)$|^(-----BEGIN PGP PRIVATE KEY BLOCK-----).*([a-zA-Z0-9//\n/.:+ =]+).*(-----END PGP PRIVATE KEY BLOCK-----)$/;
export const ECSDSA_PV_KEY_REGEX: RegExp =
    /^-----BEGIN ECDSA PRIVATE KEY-----\s.*,ENCRYPTED(?:.|\s)+?-----END ECDSA PRIVATE KEY-----$/;
export const JWK_PV_KEY_REGEX: RegExp =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
export const PKCS_PV_KEY_REGEX: RegExp =
    /^(?:Signer|Recipient)Info(?:s)?\\ ::=\\ \w+|[D|d]igest(?:Encryption)?Algorithm|EncryptedKey\\ ::= \w+$/;
export const PUTTY_PV_KEY_RSA_REGEX: RegExp =
    /^PuTTY-User-Key-File-2: ssh-rsa\s*Encryption: none(?:.|\s?)*?Private-MAC:$/;
export const PUTTY_PV_KEY_DSA_REGEX: RegExp =
    /^PuTTY-User-Key-File-2: ssh-dss\s*Encryption: none(?:.|\s?)*?Private-MAC:$/;
export const SSL_PV_KEY_REGEX: RegExp =
    /^-----BEGIN CERTIFICATE-----(?:.|\n)+?\s-----END CERTIFICATE-----$/;
