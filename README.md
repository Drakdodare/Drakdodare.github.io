> [!NOTE]
> Hello, as you may have noticed, this hasen't been updated in quite some time. This is sadly due to my lack of time and some personal issues. I do still plan on updating this in the future, but I can't give any ETA on when that will be. Thank you for your understanding!

> [!TIP]
> Use the latest release tag whenever possible, because it typically represents the most stable and well-tested snapshot of the project at a given point in time. Latest tags are usually accompanied by release notes that document new features, fixes, known issues, and any migration steps you may need, which makes upgrades more predictable and troubleshooting far easier.

> [!IMPORTANT]
> Breaking changes may be introduced without notice, so you should assume that behavior, configuration, APIs, file formats, or dependencies can shift between versions—even between seemingly minor updates. To reduce operational risk, review release notes and commit history before upgrading, validate changes in an isolated environment, and add contract tests or integration tests that quickly detect incompatibilities. Where feasible, lock dependency versions, maintain a compatibility matrix for critical components, and document upgrade procedures so that changes do not surprise downstream consumers.

> [!WARNING]
> Do not use this in production environments, as it may lack the reliability, security hardening, performance characteristics, observability hooks, or backward-compatibility guarantees required for production-grade workloads. Production usage can expose you to outages (e.g., crashes, memory leaks, corrupt state), data integrity issues, and security vulnerabilities, particularly if the project is experimental, under-maintained, or not designed with threat modeling and operational controls in mind. If you must evaluate it, restrict use to non-production contexts such as local development, feature previews, or controlled staging environments with non-sensitive data, strict access controls, and explicit rollback plans.

> [!CAUTION]
> This project has not been updated recently, which can be an indicator of elevated risk: unresolved bugs, unpatched vulnerabilities in transitive dependencies, outdated build tooling, and reduced compatibility with current platforms or runtimes. Before adopting it, assess repository activity (issues, pull requests, maintainer responsiveness), verify licensing and supply-chain posture, scan dependencies for known CVEs, and consider alternatives with active maintenance. If you proceed, plan for ownership: you may need to fork, patch, vendor dependencies, add automated testing, and establish a maintenance cadence to ensure the component remains safe and operable over time.
