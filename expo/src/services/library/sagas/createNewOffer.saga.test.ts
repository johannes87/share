import { describe, expect, it, jest } from "@jest/globals";
import fs from "expo-fs";
import { testSaga } from "redux-saga-test-plan";
import { RepoType } from "../../../shared.constants";
import { RepoInRedux } from "../../../shared.types";
import { selectRepoById } from "../../repo/repo.state";
import {
  createNewOfferEffect,
  createNewOfferSagaAction,
} from "../library.saga";

let mockStart = 1607000000000;
jest.mock("../../../utils/time.utils", () => {
  return {
    getTimestampSeconds: () => {
      const d = new Date(mockStart);
      // Add 10s to each call
      mockStart = mockStart + 10;
      return Math.round(d.getTime() / 1e3);
    },
  };
});

describe("createNewOfferEffect()", () => {
  it("Creates a new offer #nsn5S8", () => {
    testSaga(
      createNewOfferEffect,
      createNewOfferSagaAction({
        offer: {
          uuid: "offer1-uuid",
          bodyMarkdown: "An offer example",
          proximity: 0,
          shareToProximity: 1,
          title: "An example offer",
          tags: [],
        },
        repoId: "repo1",
      })
    )
      .next()
      .select(selectRepoById, "repo1")
      .next({
        id: "repo1",
        name: "repo1",
        title: "repo1",
        bodyMarkdown: "",
        isReadOnly: false,
        remoteUrl: "",
        type: RepoType.library,
        headCommitObjectId: "",
        lastFetchTimestamp: 0,
      } as RepoInRedux)
      .call(fs.promises.mkdir, "/repos/repo1/an-example-offer")
      .next()
      .inspect((effect) => expect(effect).toMatchSnapshot())
      //       .call(
      //         fs.promises.writeFile,
      //         "/repos/repo1/an-example-offer/index.md",
      //         `---
      // uuid: offer1-uuid
      // proximity: 0
      // shareToProximity: 1
      // title: An example offer
      // tags: []
      // createdAt: 1607000000
      // updatedAt: 1607000000
      // ---
      // An offer example
      // `,
      //         { encoding: "utf8" }
      //       )
      .next()
      .inspect((effect) => expect(effect).toMatchSnapshot())
      .next()
      .isDone();
  });

  it("Terminates with an error for a non existent repoId #dussrU", () => {
    testSaga(
      createNewOfferEffect,
      createNewOfferSagaAction({
        offer: {
          uuid: "offer1-uuid",
          bodyMarkdown: "An offer example",
          proximity: 0,
          shareToProximity: 1,
          title: "An example offer",
          tags: [],
        },
        repoId: "repo1",
      })
    )
      .next()
      .select(selectRepoById, "repo1")
      .next()
      .inspect((effect) => expect(effect).toMatchSnapshot())
      // .put(
      //   createNewOfferError({
      //     message: "Repo does not exist #xJeqQd",
      //     meta: { repoId: "repo1" },
      //   })
      // )
      .next()
      .isDone();
  });
});
