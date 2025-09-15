# 🚀 Deployment Guide

**GitHub Repository:** [https://github.com/VaibhavChaudhary3108/RSP_Data_Visualization_App](https://github.com/VaibhavChaudhary3108/RSP_Data_Visualization_App)

## Vercel (Recommended)

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VaibhavChaudhary3108/RSP_Data_Visualization_App)

### Manual Deploy
1. **Fork this repository**
2. **Go to [Vercel](https://vercel.com)**
3. **Import your forked repository**
4. **Deploy with default settings**

## Other Platforms

### Netlify
1. Build: `npm run build`
2. Drag `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

### GitHub Pages
1. Build: `npm run build`
2. Push `dist` contents to `gh-pages` branch
3. Enable Pages in repository settings

## Build Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build locally
npm run preview
```

## Troubleshooting

- **Build fails**: Run `npm install` first
- **Charts not loading**: Check browser console for errors
- **Data not showing**: Ensure `public/data.csv` exists

---

**Ready to deploy! 🚀**