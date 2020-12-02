import Bluebird from "bluebird";
import git from "isomorphic-git";
import original from "original";
import { gitFsHttp, GIT_AUTHOR_NAME } from "../../shared.constants";
import { FS, GitParams, Headers } from "../../shared.types";
import { join } from "../fs/fs.service";

export type StatusMatrixLine = [string, 0 | 1, 0 | 1 | 2, 0 | 1 | 2 | 3];
export type StatusMatrix = StatusMatrixLine[];

export const gitAddAllFromStatusMatrix = async (
  params: {
    statusMatrix: StatusMatrix;
  } & GitParams
) => {
  const { statusMatrix, ...gitBaseParams } = params;

  const linesWithChanges = await Bluebird.filter(statusMatrix, async (row) => {
    const [filepath, headStatus, workdirStatus, stageStatus] = row;

    // If all status rows are 1, nothing to do, this file is up to date
    if (headStatus === 1 && workdirStatus === 1 && stageStatus === 1) {
      return false;
    }

    // If this file is not up to date in the index, add it to the index now
    if (stageStatus !== 2) {
      await git.add({ ...gitFsHttp, ...gitBaseParams, filepath });
    }

    return true;
  });

  if (linesWithChanges.length > 0) {
    return true;
  }
  return false;
};

/**
 * `git add . && git commit message`
 *
 * @returns Boolean True if a new commit was made, false if not
 */
export const gitAddAndCommit = async (
  params: { message: string } & GitParams
) => {
  const { message, ...gitBaseParams } = params;

  const statusMatrix = await git.statusMatrix({
    ...gitFsHttp,
    ...gitBaseParams,
  });

  const filesToCommit = await gitAddAllFromStatusMatrix({
    ...gitBaseParams,
    statusMatrix,
  });

  if (filesToCommit) {
    const newCommitHash = await git.commit({
      ...gitFsHttp,
      ...params,
      author: {
        name: GIT_AUTHOR_NAME,
      },
    });
    return newCommitHash;
  }
  return false;
};

export const gitInitNewRepo = async ({ path }: { path: string }) => {
  const { fs } = gitFsHttp;
  await git.init({ fs, dir: path });
};

/**
 * Given a source repo git directory, set the remote URL (prefixed with
 * `encrypted::`).
 */
export const gitSetEncryptedRemote = async ({
  sourceGitDir,
  encryptedRemoteUrl,
}: {
  sourceGitDir: string;
  encryptedRemoteUrl: string;
}) => {
  const { fs } = gitFsHttp;

  await git.addRemote({
    fs,
    gitdir: sourceGitDir,
    remote: "origin",
    // TODO Figure out a better way to prefix `encrypted::`
    url: `encrypted::${encryptedRemoteUrl}`,
    force: true,
  });
};

/**
 * Given the source repo git directory, add the `http.extraHeader` setting(s)
 * to the `.git/encrypted/` git repository.
 *
 * NOTE: These settings are ignored by `isomorphic-git`, we store them here
 * only as a convenience.
 */
export const gitSetEncryptedExtraHeaders = async ({
  encryptedRemoteUrl,
  headers,
  sourceGitDir,
  fs = gitFsHttp.fs,
}: {
  sourceGitDir: string;
  encryptedRemoteUrl: string;
  headers: Headers;
  fs: FS;
}) => {
  const encryptedGitDir = join(sourceGitDir, "/encrypted/.git/");
  const urlOrigin = original(encryptedRemoteUrl);

  // First, remove any existing headers, we want this function to idempoetently
  // set all the headers for a given origin.
  await git.setConfig({
    fs,
    gitdir: encryptedGitDir,
    path: `http.${urlOrigin}.extraHeader`,
    value: undefined,
  });

  await Bluebird.each(Object.entries(headers), ([key, val]) => {
    return git.setConfig({
      fs,
      gitdir: encryptedGitDir,
      path: `http.${urlOrigin}.extraHeader`,
      value: [key, val].join(": "),
      append: true,
    });
  });
};
