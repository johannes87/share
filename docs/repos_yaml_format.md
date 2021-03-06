# Repos.yaml format

In the user's "me" repo, there lives a `repos.yaml` file. It is a single
sequence (array) of mappings (objects).

Each entry contains the following fields:

- `name`\* string - A human readable name for this repo
- `remotes`\* - A sequence (array) of mappings (object) of the following shape:
  - NOTE: Only a single entry in `remotes` is currently supported.
  - `url`\* string - A git URL (currently only http(s) urls are supported)
    - Can contain `user:pass@` to authenticate the url
  - `headers` - A mapping (object) containing header names and values
    - These should be passed to the remote, potentially for authentication
      purposes
  - `keys` - A mapping (object) with encryption (and decryption) keys
    - `keys.content` string - A 32 byte, base64 encoded key to encrypt file contents
    - `keys.filenames` string - A 32 byte, base64 encoded key to encrypt file names
    - `keys.salt` string - A 32 byte, base64 encoded key used as a salt to create
      deterministic nonce values for encrypting file names and contents
    - See
      [git-remote-encrypted](https://github.com/GenerousLabs/git-remote-encrypted/)
      for more information about the encryption scheme in use
  - `keyPassword` string - A password used to derive the keys from salt and
    other params stored in the repo
    - See
      [git-remote-encrypted](https://github.com/GenerousLabs/git-remote-encrypted/)
      for more information about the encryption scheme in use
    - NOTE: If `keyPassword` and `keys` exist `keyPassword` takes precedence.
- `id`\* string - A unique identifier for this repo
  - Must be unique in the file
- `following`\* boolean - If this is a repo that I'm following (read only)

Fields marked \* are required, the rest are optional.
