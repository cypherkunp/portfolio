## Package.json Analyzer - Functional Requirements

### 1. File Upload

**FR-1.1** The system shall allow users to upload a `package.json` file via a file input control.

**FR-1.2** The system shall only accept files with `.json` extension or `application/json` MIME type.

**FR-1.3** The system shall display the uploaded file name after successful selection.

**FR-1.4** The system shall support re-uploading a new file to replace the current analysis.

---

### 2. File Parsing & Validation

**FR-2.1** The system shall parse the uploaded file as JSON and validate its structure.

**FR-2.2** The system shall detect and report invalid JSON with an appropriate error message: "The uploaded file is not a valid JSON file. Please check the file format and try again."

**FR-2.3** The system shall detect when no `dependencies` or `devDependencies` exist and display: "No dependencies or devDependencies found in the package.json file. Please upload a file with at least one dependency."

**FR-2.4** The system shall extract project metadata from the package.json including: `name`, `description`, `version`, `license`, `author`, and `repository`.

---

### 3. Project Metadata Display

**FR-3.1** Upon successful parsing, the system shall display project metadata in the upload section.

**FR-3.2** The system shall display the following metadata fields:

- Name (required)
- Description (optional)
- Version (required, default "0.0.0")
- License (optional)
- Author (supports string or object format with `name`, `email`, `url`)
- Repository (supports string or object format, displays as clickable link)

**FR-3.3** The metadata shall be displayed in a horizontal row layout.

---

### 4. Dependency Tables

**FR-4.1** The system shall display dependencies and devDependencies in two separate tabs.

**FR-4.2** Each tab shall display a badge showing the count of packages (e.g., "15 packages").

**FR-4.3** Each table shall display the following columns:

- Expand/Collapse toggle button
- Package name (monospace font)
- Current/Configured version
- Latest version (with visual indicator if outdated)
- Known issues count
- Last published date
- Links (npm, GitHub)

**FR-4.4** The system shall visually indicate when a package is outdated (current version differs from latest version).

**FR-4.5** The system shall display a checkmark icon for up-to-date packages and an alert icon for outdated packages.

---

### 5. Package Information Fetching

**FR-5.1** For each dependency, the system shall fetch the following information from the npm registry:

- Description
- Latest version
- Last published date
- GitHub repository URL (extracted from repository field)

**FR-5.2** The system shall implement request throttling (100ms delay between requests) to prevent API rate limiting.

**FR-5.3** The system shall fetch packages sequentially to provide progressive loading feedback.

**FR-5.4** The system shall implement a 10-second timeout for each API request.

---

### 6. Expandable Row Details

**FR-6.1** Each package row shall be expandable to show additional details.

**FR-6.2** The expanded view shall display:

- Full description
- Current version
- Latest version
- Known issues count
- Last published date

**FR-6.3** The system shall provide "Expand All" and "Collapse All" buttons for bulk operations.

**FR-6.4** The "Expand All" button shall be disabled when all rows are expanded.

**FR-6.5** The "Collapse All" button shall be disabled when all rows are collapsed.

---

### 7. Column Sorting

**FR-7.1** The system shall support sorting by the following columns:

- Package name (alphabetical)
- Current version
- Latest version
- Issues count (numeric)
- Last published date (chronological)

**FR-7.2** Clicking a column header shall cycle through sort states: ascending → descending → no sort.

**FR-7.3** The system shall display sort direction indicators (up arrow, down arrow, or neutral icon).

**FR-7.4** Sorting shall be performed client-side on the filtered dataset.

---

### 8. Search/Filter

**FR-8.1** The system shall provide a search input field for filtering packages.

**FR-8.2** The search shall filter packages by matching against:

- Package name
- Package description

**FR-8.3** The search shall be case-insensitive.

**FR-8.4** The search shall update results dynamically as the user types.

**FR-8.5** When no packages match the search query, the system shall display: "No packages found matching 'query'"

**FR-8.6** The system shall display a count showing filtered results (e.g., "8 of 15 packages").

---

### 9. Error Handling

**FR-9.1** The system shall handle the following error types:

- `parse`: Invalid JSON file
- `empty`: No dependencies found
- `api`: General API failure
- `rate-limit`: API rate limit exceeded

**FR-9.2** On API failure during fetching, the system shall NOT display partial data.

**FR-9.3** On API failure, the system shall clear any partially loaded data and display an error message.

**FR-9.4** The system shall provide a "Try Again" button on all error states.

**FR-9.5** For rate limit errors, the system shall display: "API rate limit exceeded. Please wait a few minutes before trying again."

**FR-9.6** For general API errors, the system shall display: "Failed to fetch package information from npm registry. Please try again."

**FR-9.7** The "Try Again" button shall re-process the last uploaded file.

---

### 10. Loading States

**FR-10.1** The system shall display a loading indicator while processing the file.

**FR-10.2** During loading, the system shall display a placeholder state with text "Analyzing packages..."

**FR-10.3** The loading state shall maintain consistent layout (no layout shift).

---

### 11. Empty States

**FR-11.1** Before any file is uploaded, the system shall display: "No file uploaded - Upload a package.json file to see detailed information about your project dependencies"

---

### 12. External Links

**FR-12.1** Each package shall have a link to its npm page: `https://www.npmjs.com/package/{packageName}`

**FR-12.2** If available, each package shall have a link to its GitHub repository.

**FR-12.3** All external links shall open in a new tab with `rel="noopener noreferrer"`.

**FR-12.4** The repository link in project metadata shall be clickable when available.

---

### 13. Responsiveness

**FR-13.1** The application shall be fully responsive across mobile, tablet, and desktop viewports.

**FR-13.2** On smaller viewports, certain table columns shall be hidden:

- "Current" and "Latest" columns hidden below `md` breakpoint
- "Issues" column hidden below `lg` breakpoint
- "Last Published" column hidden below `xl` breakpoint

**FR-13.3** On mobile, version information shall be displayed inline below the package name.

**FR-13.4** The layout shall not shift when scrollbar appears/disappears (use `scrollbar-gutter: stable`).

---

### 14. API Integration

**FR-14.1** The system shall use the npm registry API: `https://registry.npmjs.org/{packageName}`

**FR-14.2** The system shall gracefully handle non-JSON responses from the API.

**FR-14.3** The system shall extract and clean GitHub URLs from various repository field formats:

- String format
- Object format with `url` property
- URLs with `git+`, `git://`, `.git`, `ssh://git@` prefixes

---
