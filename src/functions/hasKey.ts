import { MainImplResponse } from "probot";

export default function foundPrivateKey(res: MainImplResponse[]): boolean {
    let allKeysFound: string[] = [];
    res.map((r: MainImplResponse) =>
        r.keysFound.map((key: string) => allKeysFound.push(key)),
    );
    if (allKeysFound.every((key: string) => key === "")) return false;
    else return true;
}
