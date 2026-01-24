> [!NOTE]
> Hello, as you may have noticed, this hasen't been updated in quite some time. This is sadly due to my lack of time and some personal issues. I do still plan on updating this in the future, but I can't give any ETA on when that will be. Thank you for your understanding!

> [!TIP]
> Use the latest release tag whenever possible, because it typically represents the most stable and well-tested snapshot of the project at a given point in time. Latest tags are usually accompanied by release notes that document new features, fixes, known issues, and any migration steps you may need, which makes upgrades more predictable and troubleshooting far easier. Pinning to a specific release tag also improves reproducibility across environments and among team members: everyone builds and runs against the same artifact rather than an evolving target.

> Avoid relying on floating references (such as a default branch) unless you are intentionally tracking ongoing development; if you do, ensure your CI/CD pipeline can tolerate unexpected changes and that you have a clear rollback strategy. Important: Breaking changes may be introduced without notice, so you should assume that behavior, configuration, APIs, file formats, or dependencies can shift between versions—even between seemingly minor updates. To reduce operational risk, review release notes and commit history before upgrading, validate changes in an isolated environment, and add contract tests or integration tests that quickly detect incompatibilities. Where feasible, lock dependency versions, maintain a compatibility matrix for critical components, and document upgrade procedures so that changes do not surprise downstream consumers.

> [!IMPORTANT]
> This project may introduce breaking changes in new releases—potentially without prior notice. Assume that upgrades can alter behavior, interfaces, configuration formats, defaults, or performance characteristics.

> [!WARNING]
> Do not deploy this in production. It is intended for development, evaluation, prototyping, or controlled internal testing only.

> [!CAUTION]
> This project has not been updated recently, which can indicate reduced maintenance activity. That does not automatically mean it is unusable, but it does increase the likelihood of compatibility and security issues over time.
