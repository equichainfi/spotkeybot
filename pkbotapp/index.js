/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = app => {
	app.log.info("[pkbotapp] loaded");

	app.on(["pull_request.opened","pull_request.reopened","pull_request.edited"], async context => {});
};

// 1. Make checks
// 2. run the implementation in main.py or main.rs
// 3. if the implementation findes any key, fail the check
// 4. then add label to the PR, `pk`
// 5. if the implementation findes no key, pass the check
// 6. then remove label to the PR, `pk` and change to `secure`

// Implementation: l_impl/python/main.py ✅
// Implementation: l_impl/rust/main.rs 🧑🏼‍🏭
