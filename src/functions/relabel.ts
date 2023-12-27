/* eslint-disable @typescript-eslint/no-explicit-any */
import { FOUND_LABEL_MESSAGE, NOT_FOUND_LABEL_MESSAGE } from "./utils";

export default async function relabel(context: any, found: boolean) {
    let allPrLabels = await context.octokit.issues.listLabelsOnIssue({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: context.payload.pull_request.number,
    });
    let labels: string[] = allPrLabels.data.map((label: any) => label.name);
    if (labels.includes(FOUND_LABEL_MESSAGE) && !found) {
        await context.octokit.issues.removeLabel({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            issue_number: context.payload.pull_request.number,
            name: FOUND_LABEL_MESSAGE,
        });
    } else if (labels.includes(NOT_FOUND_LABEL_MESSAGE) && found) {
        await context.octokit.issues.removeLabel({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            issue_number: context.payload.pull_request.number,
            name: NOT_FOUND_LABEL_MESSAGE,
        });
    }
}
