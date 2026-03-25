---
name: release
description: Use when releasing a new version of OWC — bumps version, rebuilds CDN bundle, updates README links, commits, tags, and pushes.
---

# OWC Release

## Steps

**1. Confirm new version**

Ask the user: "Releasing as vX.Y.Z?" — or determine from context (patch/minor/major bump from current).

Check current version:
```bash
cat package.json | grep '"version"'
```

**2. Bump version in `package.json`**

Edit `"version"` field to the new version.

**3. Rebuild CDN bundle**

```bash
bun run build:cdn
```

Verify output: `dist/components.js` updated.

**4. Update README CDN links**

Replace all occurrences of the old version tag (e.g. `@v1.0.0`) with the new one (e.g. `@v1.1.0`) in `README.md`.

**5. Commit**

```bash
git add package.json dist/components.js README.md
git commit -m "release: vX.Y.Z"
```

**6. Tag & push**

```bash
git tag vX.Y.Z
git push origin main --tags
```

**7. Confirm**

Tell the user:
- New jsDelivr URL: `https://cdn.jsdelivr.net/gh/reneoun/Open-Web-Components@vX.Y.Z/OWC/dist/components.js`
- Tag is live on GitHub

## Version convention

| Change | Bump |
|---|---|
| Bug fix, style tweak | patch (1.0.**1**) |
| New component or feature | minor (1.**1**.0) |
| Breaking API change | major (**2**.0.0) |
