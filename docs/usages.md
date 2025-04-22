# Akeneo Custom App Demo - Covered Usages

This document outlines the various usages and features of the Akeneo Custom App Demo.

## Akeneo Integration

### App Installation and Configuration
- Install the custom app in your Akeneo PIM instance
- Authorize API access through the OAuth flow
- Configure app settings through the system interface
- Store the authentication token securely in the database to be used for API calls

### API Connectivity
- Seamless integration with Akeneo API
- Automatic token refresh and session management
- Secure data exchange between Akeneo and the custom app

## UI Extensions

### Shop Apotheke Indication Management
- View and manage product indications across multiple channels
- Toggle indications on/off using the checkbox interface
- Changes are saved immediately to the product data

### Usage Steps:
1. Navigate to a product in Akeneo PIM
2. Access the Shop Apotheke UI extension
3. Select which indications apply to each channel
4. Changes are automatically saved

## Product Hooks

### Product Preload Hook
- Display contextual information when viewing products
- Show premium partner badges for qualifying products
- Enhance product editing with additional data

### Product Validation Hook
- Validate product data before saving
- Enforce business rules and data quality standards
- Provide feedback on validation errors

## Event Consumption

### History management

- React to Akeneo events in real-time
- Process product updates from Akeneo
- Store product history only on specific attribute changes into an Akeneo table attribute

### Product bundle management

- Manage product bundles based on Akeneo events
- Create and update associations in real-time
- Ensure data consistency across product bundles
