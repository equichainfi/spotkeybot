import { FOUND_LABEL_MESSAGE, NOT_FOUND_LABEL_MESSAGE } from "./utils";

export default function addLabel(found: boolean): string {
    return found ? FOUND_LABEL_MESSAGE : NOT_FOUND_LABEL_MESSAGE;
}
