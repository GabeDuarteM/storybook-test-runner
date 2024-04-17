import { TestRunnerConfig, waitForPageReady } from "@storybook/test-runner";
import { toMatchImageSnapshot } from "jest-image-snapshot";

const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForPageReady2 = async (page) => {
  console.log("Start waiting for page to be ready");
  await page.waitForLoadState("domcontentloaded");
  console.log("DOM content loaded");
  await page.waitForLoadState("load");
  console.log("Page loaded");
  await page.waitForLoadState("networkidle");
  // console.log("Network idle");
  await page.evaluate(() => document.fonts.ready);
  console.log("Fonts ready");
};

const config: TestRunnerConfig = {
  async prepare({ page, browserContext, testRunnerConfig }) {
    page.setDefaultTimeout(5 * 60 * 1000);

    const targetURL = process.env.TARGET_URL;
    const iframeURL = new URL("iframe.html", targetURL).toString();

    if (testRunnerConfig.getHttpHeaders) {
      const headers = await testRunnerConfig.getHttpHeaders(iframeURL);
      await browserContext.setExtraHTTPHeaders(headers);
    }

    await page.goto(iframeURL, { waitUntil: "load" }).catch((err) => {
      if (
        err instanceof Error &&
        err.message.includes("ERR_CONNECTION_REFUSED")
      ) {
        const errorMessage = `Could not access the Storybook instance at ${targetURL}. Are you sure it's running?\n\n${err.message}`;
        throw new Error(errorMessage);
      }

      throw err;
    });
  },
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    // use the test-runner utility to wait for fonts to load, etc.
    // await waitForPageReady(page);
    await waitForPageReady2(page);
    // await sleep(5 * 1000);

    // If you want to take screenshot of multiple browsers, use
    // page.context().browser().browserType().name() to get the browser name to prefix the file name
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir,
      customSnapshotIdentifier: context.id,
    });
  },
};
export default config;
