# Superflat Studio

Portfolio CMS and frontend monorepo.

## Structure

- **studio/** — Sanity CMS (content editing, schemas, deployment)
- **Frontend/** — Static frontend that displays the portfolio
- **ToVModulator/** — Tone Modulator app (separate project)

## Commands

**Sanity Studio** (from root):
```bash
npm run studio:dev      # Start Sanity Studio
npm run studio:build    # Build for deployment
npm run studio:deploy   # Deploy Studio
```

Or run directly from `studio/`:
```bash
cd studio && npm run dev
```

**Frontend**:
```bash
npm run frontend:serve  # Serve Frontend at localhost:3000
```
