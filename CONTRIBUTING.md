# Contributing to Exilence Next

We appreciate any help in the project we can get. Before doing so, however, we have some guidelines we'd like for you to follow:

 - [Submission Guidelines](#submit)
 - [Coding Guidelines](#coding)

## Submission Guidelines

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub](https://github.com/viktorgullmark/exilence-next/pulls) for an open or closed PR
  that relates to your submission before creating a new one.
1. Be sure that an issue describes the problem you're fixing.
1. Fork the viktorgullmark/exilence-next repo.
1. Make your changes in a new git branch:

     ```shell
     git checkout -b my-fix-branch master
     ```

1. Commit your changes using a descriptive commit message.

     ```shell
     git commit -a
     ```
    Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

1. Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

1. In GitHub, send a pull request to `exilence-next:master`.

## Coding Guidelines

1. In general, we follow [AirBnbs styleguides](https://github.com/airbnb/javascript/tree/master/react) whenever applicable. 

2. Always use Material UI components whenever possible.

3. Type everything (no exceptions). We will not accept pull requests with an object declared as `any`.

4. Translate everything. We use react-i18next for translating, keys should be added in suiting namespace in 
[/public/i18n](https://github.com/viktorgullmark/exilence-next/tree/master/ExilenceNextApp/public/i18n/en). If a suiting namespace does not exist, feel free to create one (needs to be included in the [config](https://github.com/viktorgullmark/exilence-next/blob/master/ExilenceNextApp/src/i18n/index.ts)).

## Required extensions

For contributions to the client, you should have the following extensions installed in VS code:

1. [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 

2. [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
