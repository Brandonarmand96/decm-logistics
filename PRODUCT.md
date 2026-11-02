# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React, TypeScript, and Vite deliver the installable progressive web application. An Express TypeScript API, SQLite database, JWT sessions, local document storage, PDFKit reporting, Zod validation, and Vitest integration tests provide the local production foundation.

## Users

Primary users are DECM Nexus operations staff coordinating logistics and procurement jobs, and business customers requesting services, approving quotations, tracking work, and downloading evidence. Transport partners and suppliers are secondary users represented in phase two workflows.

## Product Purpose

The product provides one operational record from a customer's service request through quotation, assignment, tracking, delivery evidence, invoicing, procurement, and reporting. Success means customers can see what is happening without repeatedly calling staff, while the internal team can coordinate work and retain an audit trail.

## Positioning

DECM Nexus combines logistics coordination, procurement control, documentation, and client reporting in one managed service rather than functioning only as a transporter directory.

## Operating Context

Users work with transport requests, quotations, shipment documents, pickup and delivery checkpoints, expenses, invoices, suppliers, requests for quotation, approvals, purchase orders, and goods-received records. Connectivity may be inconsistent, so core read access and previously loaded application assets should remain available through PWA caching.

## Capabilities and Constraints

- Phase one: service requests, quotations, job management, status tracking, document records, delivery evidence, invoicing, and customer notifications.
- Phase two: transporter onboarding, procurement workflows, supplier management, expenses, profitability, and customer reporting.
- This build is a responsive PWA, not a native mobile application.
- Business records persist in SQLite, with authenticated API access, role checks, audit history, document storage, PDF reports, server-side validation, and rate-limited login.
- Email, WhatsApp, GPS, payment, accounting, and cloud-storage integrations remain external deployment choices rather than hard-coded dependencies.

## Brand Commitments

The product name is DECM Nexus Integrated Logistics and Consulting Ltd. Confirmed language includes “Connecting Solutions. Delivering Excellence.” and “From Strategy to Delivery.” The source branding specifies navy blue, gold, white, and silver grey, with a professional, reliable, connected identity.

## Evidence on Hand

The source document at `C:\Users\USER\Downloads\DECM Nexus Branding.docx` confirms the company name, positioning language, service categories, and brand colours. No verified customer testimonials, commercial performance data, pricing, or partner claims are available and none should be fabricated.

## Product Principles

- Make every job accountable from request to evidence.
- Show the next operational action, not just status.
- Keep customer communication proactive and understandable.
- Preserve a usable audit trail for logistics and procurement decisions.
- Design for regional operations and variable connectivity.

## Accessibility and Inclusion

The web application should support keyboard navigation, readable contrast, responsive layouts, and clear language. English is the initial interface language; French remains a future regional requirement.
