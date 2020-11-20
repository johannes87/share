import { all } from "bluebird";
import fs from "expo-fs";
import slugify from "slugify";
import { call, put, select, takeEvery } from "typed-redux-saga/macro";
import { join } from "../fs/fs.service";
import { commitAll } from "../repo/repo.actions";
import { selectRepoById } from "../repo/repo.state";
import {
  createNewOffer,
  createNewOfferError,
  loadOffer,
  loadOfferError,
} from "./library.actions";
import { offerToString, readOfferFromDisk } from "./library.service";
import { upsertOneOffer } from "./library.state";

export function* createNewOfferEffect(
  action: ReturnType<typeof createNewOffer>
) {
  const { offer } = action.payload;

  const repo = yield* select(selectRepoById, offer.repoId);

  if (typeof repo === "undefined") {
    yield put(
      createNewOfferError({
        message: "Repo does not exist #xJeqQd",
        meta: { repoId: offer.repoId },
      })
    );
    return;
  }

  const repoPath = repo.path;

  const offerString = offerToString({ offer });

  const directoryName = slugify(offer.title, { lower: true });
  const directoryPath = join(repoPath, directoryName);
  const offerPath = join(directoryPath, "index.md");

  yield* call(fs.promises.mkdir, directoryPath);
  yield* call(fs.promises.writeFile, offerPath, offerString, {
    encoding: "utf8",
  });

  yield* put(
    commitAll({
      repoId: offer.repoId,
      message: "Creating a new offer",
    })
  );
}

export function* loadOfferEffect(action: ReturnType<typeof loadOffer>) {
  const { directoryPath, repoId } = action.payload;
  try {
    const offer = yield* call(readOfferFromDisk, { directoryPath });

    yield put(upsertOneOffer({ ...offer, repoId }));
  } catch (error) {
    yield put(
      loadOfferError({
        error,
        message: "Unknown error. #arGvI7",
        meta: { repoId, directoryPath },
      })
    );
  }
}

export default function* librarySaga() {
  yield all([
    takeEvery(createNewOffer, createNewOfferEffect),
    takeEvery(loadOffer, loadOfferEffect),
  ]);
}