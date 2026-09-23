# Security Policy

## Supported Versions

We actively release security updates for the latest major version of the English Tutor Web Application. Please ensure you are using a supported version before reporting vulnerabilities.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Priorities & High-Risk Areas

As a web application handling interactive tutoring, audio/video streaming, and user profile data, our security focus prioritizes the following threat vectors:

1. **Authentication & Authorization**
   * Broken Object Level Authorization (BOLA/IDOR) preventing users/students from accessing or altering another user's profile, lesson notes, or schedules.
   * Session hijacking and weak session management.

2. **Data Privacy & Protection (PII)**
   * Exposure of Personally Identifiable Information (PII), such as full names, email addresses, payment methods, or chat/voice logs between tutors and students.

3. **Input Validation & Injection Flaws**
   * Cross-Site Scripting (XSS) via rich-text chat fields, quiz submission forms, or feedback reviews.
   * SQL Injection or NoSQL Injection in search features and user input forms.

4. **Media & File Processing**
   * Unrestricted file uploads (e.g., uploading malicious scripts disguised as audio recordings, profile pictures, or PDF assignment files).

---

## Reporting a Vulnerability

We take the security of our application and the privacy of our users seriously. If you discover a security vulnerability, please follow the responsible disclosure process below:

1. **Do NOT open a public issue or discussion** regarding the security flaw.
2. **Contact Us Directly**: Send a detailed email to **security@yourdomain.com** (or use the GitHub Private Vulnerability Reporting feature if enabled).
3. **Include the Following Details**:
   * Type of issue (e.g., XSS, Authentication Bypass, IDOR).
   * Detailed steps to reproduce the vulnerability or a Proof of Concept (PoC).
   * Impact analysis (what an attacker could achieve).
   * Affected URLs, parameters, or API endpoints.

---

## What to Expect After Reporting

* **Acknowledgment**: We will acknowledge receipt of your vulnerability report within **48 hours**.
* **Assessment & Fix**: We will work to investigate and validate the issue, providing updates on progress.
* **Public Disclosure**: Once the issue is resolved and patched, we will notify you and may credit your responsible disclosure in our release notes (unless you request anonymity).

---

## Disclosure Policy

* Please allow us a reasonable time frame (typically 30–90 days) to fix the vulnerability before making any public disclosures.
* Do not attempt to access, modify, or destroy user data without permission.
* Do not perform Denial of Service (DoS/DDoS) attacks or automated spamming against our infrastructure.

Thank you for helping keep our English Tutor application safe and reliable for all users!


