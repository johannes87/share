import { ensureDirectoryExists } from "git-encrypted";
import { all, takeEvery } from "redux-saga/effects";
import { call, put } from "typed-redux-saga/macro";
import { gitFsHttp, REPOS_PATH } from "../../shared.constants";
import { writeConfigToFilesystem } from "../config/config.service";
import { rootLogger } from "../log/log.service";
import { createCommandsRepo, createMeRepo } from "../repo/repo.service";
import { addOneRepoAction } from "../repo/repo.state";
import { maybeStartupSagaAction } from "../startup/startup.state";
import {
  setSetupCompleteAction,
  setupErrorAction,
  setupSagaAction,
} from "./setup.state";

const log = rootLogger.extend("setup.saga");

export function* setupEffect(action: ReturnType<typeof setupSagaAction>) {
  try {
    const { config } = action.payload;
    const { fs } = gitFsHttp;

    yield* call(ensureDirectoryExists, { fs, path: REPOS_PATH });

    yield* call(writeConfigToFilesystem, { config });

    const meRepo = yield* call(createMeRepo);

    yield* put(addOneRepoAction(meRepo));

    const commandsRepo = yield* call(createCommandsRepo);

    yield* put(addOneRepoAction(commandsRepo));

    yield* put(setSetupCompleteAction());

    yield* put(maybeStartupSagaAction());
  } catch (error) {
    log.error("setupErrorAction #SEU3lx", error);
    yield* put(
      setupErrorAction({
        message: "Setup error #BaTVXH",
        error,
      })
    );
  }
}

export default function* setupSaga() {
  yield all([takeEvery(setupSagaAction, setupEffect)]);
}
