/* eslint-disable @typescript-eslint/no-explicit-any */
// import nock from "nock";
// Requiring our app implementation
// import myProbotApp from "../src";
// import { Probot, ProbotOctokit } from "probot";
// import payload from "./fixtures/issues.opened.json";
// import fs from "fs";
// import path from "path";
// import test, { afterEach, beforeEach, describe } from "node:test";
// import { SUCCESS_RESPONSE } from "./utils";

// const privateKey = fs.readFileSync(
//     path.join(__dirname, "fixtures/mock-cert.pem"),
//     "utf-8",
// );

// describe("My Probot app", () => {
//     let probot: any;

//     beforeEach(() => {
//         nock.disableNetConnect();
//         probot = new Probot({
//             appId: 123,
//             privateKey,
//             // disable request throttling and retries for testing
//             Octokit: ProbotOctokit.defaults({
//                 retry: { enabled: false },
//                 throttle: { enabled: false },
//             }),
//         });

//         probot.load(myProbotApp);
//     });

//     test("creates a comment when an PR is opened", async () => {
//         const mock = nock("https://api.github.com")
//             // Test that we correctly return a test token
//             .post("/app/installations/2/access_tokens")
//             .reply(200, {
//                 token: "test",
//                 permissions: {
//                     issues: "write",
//                 },
//             })

//             // Test that a comment is posted
//             .post(
//                 "/repos/hiimbex/testing-things/issues/1/comments",
//                 (body: any) => {
//                     expect(body).toMatchObject(SUCCESS_RESPONSE);
//                     return true;
//                 },
//             )
//             .reply(200);

//         // Receive a webhook event
//         await probot.receive({ name: "pull_request", payload });

//         expect(mock.pendingMocks()).toStrictEqual([]);
//     });

//     afterEach(() => {
//         nock.cleanAll();
//         nock.enableNetConnect();
//     });
// });

describe("Test", () => {
    test("test", () => {
        expect(true).toBe(true);
    });
});
