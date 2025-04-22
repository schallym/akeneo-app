# Akeneo Custom App Demo

A React-based custom app for Akeneo PIM that allows managing demonstrate extendability of the Akeneo PIM.

## Overview

This project extends the Akeneo PIM be implementing specific features.

## Technologies

- Next.js - React framework
- TypeScript - For type safety
- Tailwind CSS - For styling
- Akeneo Design System - UI components
- React Hooks - For state management
- PostgreSQL - Database
- Upsun - Hosting platform

## Setup

**Requirements**
- Docker
- Make

1. Clone the repository
2. Install dependencies:
   ```bash
   make up
   ```

## Features

- Connect to Akeneo PIM API via the custom app system
- UI extension to manage product scopable multi-select data with a dynamic interface
- Consume Akeneo events to update product data in real-time
- Manage custom product validations
- Display badges into the product form depending on conditions

## Development

This project follows a component-based architecture with React hooks for state management and API calls to the Akeneo backend.
Please refer to the documentation for more details on the file structure and component usage.

## Documentation
- [File architecture](docs/file-architecture.md)
- [Hosting](docs/hosting.md)
- [Usages](docs/usages.md)

# Tasks to be done before deploying to production
- [ ] Set up an encoding system to store the custom app token.
- [ ] Implement to security verification of the Akeneo events.
- [ ] Implement to security verification of the Akeneo UI extensions.
- [ ] Clean unnecessary users from the code base.

