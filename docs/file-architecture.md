# File Architecture

This document outlines the file architecture of the Akeneo Custom App Demo project.

## Directory Structure

```
/
├── docs/                                   # Documentation files
├── public/                                 # Static assets
└── src/                                    # Source code
    ├── app/                                # Next.js App Router
    │   ├── api/                            # API routes
    │   │   └── akeneo-app/                 # Akeneo custom app management endpoints (e.g., activate & callback endpoints)
    │   │   └── akeneo-event/               # Akeneo event consumer endpoints
    │   │   └── akeneo-hooks/               # Akeneo webhook handlers
    │   │       └── product-preload/        # Product preload hook endpoints
    │   │       └── product-validation/     # Product validation hook endpoints
    │   ├── ui-extensions/                  # UI Extensions endpoints
    │   ├── system/                         # Application system pages
    │   │   └── app/                        # Akeneo app system page
    ├── components/                         # Reusable React components
    ├── lib/                                # Shared libraries and utilities
    │   ├── actions/                        # Actions for Redux state management
    │   ├── api/                            # API clients (e.g., Akeneo API for now)
    │   ├── getter/                         # Data retrieval utilities
    │   ├── models/                         # TypeScript type definitions
    │   │   └── hooks/                      # Models for Akeneo hook payloads
    │   ├── repositories/                   # Repositories for data DB access
    │   ├── updater/                        # Updater functions for data processing (e.g., business logic)
    │   ├── utils/                          # General utility functions
    ├─ themes/                              # Global styles and themes
    └─ ui/                                  # UI components and styles
```

## Key Directories

### `/src/app`

Contains the Next.js application using the App Router pattern. Routes are defined by the directory structure.

### `/src/app/api`

Backend API routes implemented as serverless functions:
- `akeneo-app/` - Endpoints for managing the Akeneo custom app (e.g., activation, callback)
- `akeneo-event/` - Endpoints for consuming Akeneo events
- `akeneo-hooks/` - Endpoints for Akeneo webhook integrations
- `product-preload/` - Handles product preload hooks from Akeneo

### `/src/app/ui-extensions`

Custom UI extensions that integrate into the Akeneo PIM interface:
- `shop-apotheke/` - Channel-based product indication management

### `/src/lib`

Core libraries and utilities:
- `actions/` - Redux actions for state management
- `api/` - API client implementations
- `getter/` - Functions for retrieving data from external sources
- `models/` - TypeScript interfaces and type definitions
- `repositories/` - Data access layer for interacting with the database
- `updater/` - Functions for processing and updating data
- `utils/` - General utility functions
