# Deployment & Build Guide for AVADH Imitation Jewellery ERP

## 1. Local Production Build Execution

Run the following commands in your terminal to build both backend and frontend applications:

### Build Backend
```powershell
cd e:\nakul\Avadh\backend
npm run build
```
*(This compiles TypeScript down to optimized JavaScript inside `backend/dist`)*

---

### Build Frontend
```powershell
cd e:\nakul\Avadh\frontend
npm run build
```
*(This bundles React + Tailwind + Vite into static HTML/CSS/JS files inside `frontend/dist` with the IIS `web.config` rewrite file)*

---

## 2. Deploying to Site4Now Hosting

To deploy your production build directly to your Site4Now server (`WIN8194.site4now.net`):

```powershell
cd e:\nakul\Avadh
npm install basic-ftp
node deploy.mjs
```

### Site4Now Target Info:
- **Server**: `WIN8194.site4now.net`
- **FTP User**: `avadhftp`
- **Subsite**: `jigneshsatani-001-subsite4`
- **Deployment URL**: `http://jigneshsatani-001-subsite4.site4now.net`
