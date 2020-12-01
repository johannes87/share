import { all, takeEvery } from "redux-saga/effects";
import { call, put } from "typed-redux-saga/macro";
import { createControlRepo, createMeRepo } from "../repo/repo.service";
import { commitAllAction, upsertOneRepo } from "../repo/repo.state";
import { setupAction, setupErrorAction } from "./setup.state";

export function* setupEffect() {
  try {
    const meRepo = yield* call(createMeRepo);

    yield* put(upsertOneRepo(meRepo));

    yield* put(
      commitAllAction({
        repoId: meRepo.id,
        message: "Initial me commit. #bISz6d",
      })
    );

    const controlRepo = yield* call(createControlRepo);

    yield* put(upsertOneRepo(controlRepo));

    yield* put(
      commitAllAction({
        repoId: controlRepo.id,
        message: "Initial control commit. #Nn0SdS",
      })
    );

    // - setup the remote service
    // - ????
  } catch (error) {
    yield put(
      setupErrorAction({
        message: "Setup error #BaTVXH",
        error,
      })
    );
  }
}

export default function* setupSaga() {
  yield all([takeEvery(setupAction, setupEffect)]);
}
