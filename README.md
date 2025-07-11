# Resilient Email Sending Service

A robust Node.js/TypeScript email service with retries, fallback, idempotency, rate limiting, status tracking, circuit breaker, logging, and queueing.

## Features

- Retry with exponential backoff
- Fallback between two mock providers
- Idempotency to prevent duplicate sends
- Basic rate limiting
- Status tracking for each email attempt
- Circuit breaker for provider health
- Simple logging
- Basic in-memory queue
- Unit tests

## Setup

1. **Clone and install:**
cd F:\freelance\pearl
npm install

text

2. **Build and run tests:**
npx tsc
npm test

text

## Assumptions

- Providers are mocked for demonstration.
- All storage is in-memory (no persistence).
- Rate limits, backoff, and thresholds are easily configurable in code.

## Usage

See `tests/EmailService.test.ts` for usage examples.

## Structure

Refer to the project structure in the roadmap for file organization.