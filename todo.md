Lets impelent UI for web app.

Lets setup shadcnui.
please check latest docs on how to properly setupt shadcn and how to install compoentes - add this instructions to .cursorrules.
- pnpm dlx shadcn@latest init
- pnpm dlx shadcn@latest add button

On the frontend I want:

- sidebar with filters on the left
  - location as text input
  - magnitude as a range slider from..to https://ui.shadcn.com/docs/components/slider
  - date - for this we need a range from...to - with date and time - would be nice to use shadcn components but we have a big ranges from 1970 till 2014 so we probably need to separate datetime inputs so user can quickly type date and time or select via UI
- data table https://ui.shadcn.com/docs/components/data-table on the right
  - with pagination and sorting (asc/desc)
  - last column should be "Actions" with edit / delete butons that allowso to eiit or delete record
    - edit should open form https://ui.shadcn.com/docs/components/form in dialog https://ui.shadcn.com/docs/components/dialog, with validation
    - delete should show shadcn confirmation dialig https://ui.shadcn.com/docs/components/alert-dialog
  - we should also have a button to add a new record (similar to editing)
  - we should show toast notification if adding / editing / deleting was successful or failed https://ui.shadcn.com/docs/components/toast

Add proper valition to filets and add / edit forms

Impement it with skeleton loader, lazy loading / suspense, error boudry

Lets follow atomic design principle and put Atoms, molecules and organisms into packages/ui libarary, and lets put templates and pages into apps/web components

also, check requirements.md to check if implementation fullfil the requirements.

lets connect UI with API and make sure everything work.

lets focus on specified functionality first before we start implementing extra.

please update .cursorruels and docs regaring this rules and specs
-------
 WARN  deprecated @storybook/addon-styling@1.3.7: This package has been split into @storybook/addon-styling-webpack and @storybook/addon-themes. More info: https://github.com/storybookjs/addon-styling
 WARN  deprecated apollo-server-express@3.13.0: The `apollo-server-express` package is part of Apollo Server v2 and v3, which are now end-of-life (as of October 22nd 2023 and October 22nd 2024, respectively). This package's functionality is now found in the `@apollo/server` package. See https://www.apollographql.com/docs/apollo-server/previous-versions/ for more details.