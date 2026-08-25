# 🚀 دليل النشر على Cloudflare Pages

## الخيار 1: عبر موقع Cloudflare (الأسهل، 5 دقائق)

### الخطوات:

1. **أنشئ حساباً على Cloudflare**:
   - https://dash.cloudflare.com/sign-up
   - مجاني، لا يحتاج بطاقة ائتمان

2. **ارفع المشروع على GitHub**:
   - أنشئ repository جديد على GitHub
   - ارفع كل ملفات المشروع

3. **اربط Cloudflare مع GitHub**:
   - في Cloudflare Dashboard، اذهب إلى **Workers & Pages**
   - اضغط **Create application** → **Pages** → **Connect to Git**
   - اختر الـ repository

4. **إعدادات البناء**:
   - **Project name**: `zawhan`
   - **Production branch**: `main` أو `master`
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Environment variables**: (اتركها فارغة)

5. **اضغط Save and Deploy**

6. **انتظر 2-3 دقائق** للنشر

7. **موقعك جاهز على**:
   `https://zawhan.pages.dev`

## الخيار 2: عبر Wrangler CLI (للمتقدمين)

```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy out --project-name=zawhan
```

## إضافة نطاق مخصص (اختياري)

1. في Cloudflare Pages → Custom domains
2. أضف نطاقك (مثل `zawhan.app`)
3. Cloudflare يُعطيك DNS records
4. أضفها عند مسجّل النطاق (Namecheap, GoDaddy...)

## ملاحظات

- **البناء الكامل** يأخذ 2-3 دقائق
- **CDN عالمي** — سريع في كل مكان
- **HTTPS تلقائي**
- **مجاني للأبد** — بدون حدود للزوار
- **Custom domain** متاح (مثل `zawhan.app`)

## بعد النشر

- اختبر التطبيق على جوالك
- شارك الرابط مع أصدقائك
- أضف PWA (Add to Home Screen) لتجربة كاملة
