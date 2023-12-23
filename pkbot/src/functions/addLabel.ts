/* eslint-disable indent */
import { AddLabelResponse } from "probot";

export default function addLabel(found: boolean): AddLabelResponse {
    return found
        ? {
              name: process.env.FOUND_LABEL_MESSAGE!,
              color: process.env.FOUND_LABEL_COLOR!,
          }
        : {
              name: process.env.NOT_FOUND_LABEL!,
              color: process.env.NOT_FOUND_LABEL_COLOR!,
          };
}
