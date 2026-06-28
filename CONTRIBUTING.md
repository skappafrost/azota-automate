# Contributing to Azota God Mode

Thank you for considering contributing to this project! We welcome all contributions that improve the script's functionality, reliability, or documentation.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and constructive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check the [Issues](https://github.com/skappafrost/azota-god-mode/issues) tab to see if the bug has already been reported.
2. If not, create a new issue using the **Bug Report** template.
3. Include:
   - Browser and Tampermonkey version
   - Script version
   - The exact URL where the bug occurs
   - Steps to reproduce
   - Screenshots if applicable

### Suggesting Enhancements

1. Open a feature request using the **Feature Request** template.
2. Describe the problem you're trying to solve, not just your proposed solution.
3. Explain why the feature would be useful to other users.

### Pull Requests

1. **Fork** the repository.
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**:
   - Follow the existing code style (ES5/ES6 compatible for userscript environment)
   - Add JSDoc comments for new functions
   - Test on both result pages and exam pages
4. **Commit**: Use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `refactor:` for code improvements
   - `style:` for formatting changes
5. **Push** and open a Pull Request.

## Development Setup

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Open the raw `src/azota-god-mode.user.js` file and Tampermonkey will prompt installation.
3. Navigate to any exam on `azota.vn` to test.
4. Open browser DevTools (F12) to see console logs.

## Code Style Guidelines

- Use `const` / `let` (not `var`)
- Use camelCase for functions and variables
- Prefix global helper functions with descriptive names
- Keep functions focused on a single responsibility
- Use `try/catch` around DOM manipulation that may fail silently
