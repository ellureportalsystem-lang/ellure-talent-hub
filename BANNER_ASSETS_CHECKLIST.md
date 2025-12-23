# Banner Assets Checklist

## 🖼️ Required Banner Images (MUST BE IN `public/` folder)

### Homepage Banners (Landing Page)
- ✅ `banner-1.jpg` - First homepage banner
- ✅ `banner-2.jpg` - Second homepage banner  
- ✅ `banner-3.jpg` - Third homepage banner
- ✅ `cta-banner.jpg` - Final CTA banner on homepage

### Page-Specific Banners

#### About Page
- ✅ `about-banner.jpg` - Top banner
- ✅ `about-cta-banner.jpg` - Bottom CTA banner

#### Services Page
- ✅ `services-banner.jpg` - Top banner
- ✅ `services-cta-banner.jpg` - Bottom CTA banner

#### Features Page
- ✅ `features-banner.jpg` - Top banner
- ✅ `features-cta-banner.jpg` - Bottom CTA banner

#### Industries Page
- ✅ `industries-banner.jpg` - Top banner
- ✅ `industries-cta-banner.jpg` - Bottom CTA banner

#### Contact Page
- ✅ `contact-banner.jpg` - Top banner
- ✅ `contact-cta-banner.jpg` - Business Hours section banner

## 📋 Code References

All banners are referenced in the following files:

1. **src/pages/Landing.tsx**
   - Lines 99: `banner-${currentSlide + 1}.jpg` (banner-1.jpg, banner-2.jpg, banner-3.jpg)
   - Line 410: `cta-banner.jpg`

2. **src/pages/About.tsx**
   - Line 20: `about-banner.jpg`
   - Line 216: `about-cta-banner.jpg`

3. **src/pages/Services.tsx**
   - Line 69: `services-banner.jpg`
   - Line 253: `services-cta-banner.jpg`

4. **src/pages/Features.tsx**
   - Line 75: `features-banner.jpg`
   - Line 275: `features-cta-banner.jpg`

5. **src/pages/Industries.tsx**
   - Line 82: `industries-banner.jpg`
   - Line 233: `industries-cta-banner.jpg`

6. **src/pages/Contact.tsx**
   - Line 38: `contact-banner.jpg`
   - Line 262: `contact-cta-banner.jpg`

## ⚠️ IMPORTANT: Git Tracking

**ALL BANNER IMAGES MUST BE COMMITTED TO GIT**

To ensure banners are never lost:

1. **Check if banners are tracked:**
   ```bash
   git ls-files public/*.jpg
   ```

2. **If banners are not tracked, add them:**
   ```bash
   git add public/banner-*.jpg
   git add public/*-banner.jpg
   git add public/*-cta-banner.jpg
   git add public/cta-banner.jpg
   ```

3. **Verify .gitignore doesn't exclude them:**
   - Check that `public/*.jpg` is NOT in `.gitignore`
   - Banner images should be committed to the repository

4. **Before pushing, verify:**
   ```bash
   git status public/*.jpg
   ```

## 🔒 Protection Measures

1. **Never delete banner images from `public/` folder**
2. **Always commit banner images when adding new ones**
3. **Verify banner paths match exactly (case-sensitive)**
4. **Test banners after each deployment**
5. **Keep this checklist updated when adding new banners**

## 🚨 If Banners Disappear

1. Check if images exist in `public/` folder
2. Verify git history: `git log --all --full-history -- public/*.jpg`
3. Restore from git: `git checkout HEAD -- public/banner-*.jpg`
4. Verify image paths in code match actual filenames
5. Check browser console for 404 errors on banner images

