import { describe, it, expect } from "@jest/globals";
import { matches } from "lodash";
import createMockStore from "redux-mock-store";
import { testSaga } from "redux-saga-test-plan";
import { call } from "redux-saga/effects";
import { RepoType } from "../../../shared.constants";
import { RepoInRedux } from "../../../shared.types";
import { invariantSelector } from "../../../utils/invariantSelector.util";
import { commitAllEffect, commitAllSagaAction } from "../../repo/repo.saga";
import { selectCommandRepo, selectRepoById } from "../../repo/repo.state";
import { addReadAuthTokenForRepo } from "../commands.service";
import { effect, request } from "./createReadAuthTokenForRepo.saga";

describe("createReadAuthTokenForRepo.saga", () => {
  it("Creates a new invitation and returns a token #QkEGyv", () => {
    const repo = {
      id: "repo1",
      uuid: "repo1",
      path: "/repo1/",
      headCommitObjectId: "",
      lastFetchTimestamp: 0,
      bodyMarkdown: "",
      isReadOnly: false,
      name: "repo1",
      remoteUrl: "",
      title: "repo1",
      type: RepoType.connection,
    } as RepoInRedux;
    const commandRepo = {
      ...repo,
      id: "commands",
      uuid: "commands",
      path: "commands",
      name: "commands",
      title: "commands",
      type: RepoType.commands,
    };

    // NOTE: We need to define this as '' here otherwise TypeScript complains
    // below that it is used before being defined.
    let token: string = "";

    testSaga(
      effect,
      request({
        repoId: "repo1",
      })
    )
      .next()
      .inspect((val) => expect(val).toMatchSnapshot())
      .next(repo)
      .inspect((val) => expect(val).toMatchSnapshot())
      .next(commandRepo)
      .inspect((callEffect) => {
        const matchEffect = call(addReadAuthTokenForRepo, {
          repo,
          token: (expect.any(String) as unknown) as string,
        });
        expect(callEffect).toEqual(matchEffect);
        token = (callEffect as any).payload.args[0].token;
      })
      .next()
      .inspect((callEffect) => {
        const matchEffect = call(
          commitAllEffect,
          commitAllSagaAction({
            repoId: commandRepo.id,
            message: (expect.any(String) as unknown) as string,
          })
        );
        expect(callEffect).toEqual(matchEffect);
      })
      .next()
      .returns({ token });
  });

  // it('Returns the token when passed to store.dispath #8iqXoi', () => {
  //   const store = createMockStore()
  // })
});
