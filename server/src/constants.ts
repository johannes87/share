import { join } from "path";

// NOTE: We need a `../` here because this gets run in the `dist/` folder
export const REPOS_ROOT = join(process.cwd(), "data/repos");
export const COMMANDS_REPO_NAME = "commands.git" as const;

export const REPO_TEMPLATE_PATH = join(process.cwd(), "templates/empty-repo");

export const USER_TOKEN_PATH = join(
  REPOS_ROOT,
  "commands.git",
  "user_tokens.yaml"
);

export const ENOENT = "ENOENT" as const;

// NOTE: These 3 are copied to `expo/src/shared.constants.ts` file and must be
// manually kept in sync in both.
export const READ_TOKENS_FILE_NAME = "read_tokens.txt" as const;
export const MINIMUM_USERNAME_LENGTH = 3 as const;
export const MINIMUM_TOKEN_LENGTH = 20 as const;
