# Notes learned through doing

## This is page that we will use to document our learning process and insights gained throughout the project.

#### The difference between default export and export

- Default export allows you to export a single value or component from a module, making it easier to import without curly braces.
- Named export allows you to export multiple values or components from a module, requiring curly braces when importing.

#### OBJECT deconstructing

const {password: \_, ...userWithoutPassword} = foundUser;

- In this line the password property is being extracted from foundUser and discarded (using \_ as a placeholder), while the rest of the user object is being collected into userWithoutPassword.
