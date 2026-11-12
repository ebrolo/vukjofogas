# 🏢 VUK Jófogás – Kollégiumi Apróhirdető Weboldal

Egy végtelenül egyszerű, letisztult, villámgyors Next.js 16 + React 19 webalkalmazás a VUK kollégistáknak.

---

## ⚡ Főbb funkciók

- **Nulla regisztráció / login**: Csak megadod a szobaszámodat, a termék nevét, leírását, árát és kész.
- **Közvetlen szobaszám jelvény**: Minden kártyán kiemelten látszik a szoba (pl. `312-es szoba`), így a vevő azonnal fel tud ugrani érte.
- **Kliensoldali képtömörítés (0 tárhely macera)**: A mobilról lőtt fotókat a böngésző automatikusan lekicsinyíti WebP formátumba, így nincs szükség bonyolult külső képtárhelyre.
- **1 kattintásos "Elkelt" gomb**: Bárki megjelölheti ha elkelt, vagy visszaállíthatja, ha mégsem vitték el.
- **Élő keresés & szűrés**: Keresés névre, leírásra vagy szobaszámra, külön szűrők: *Elérhető*, *Összes*, *Ingyen elvihető*, *Elkelt*.
- **Mobilra optimalizált**: Messenger / Discord / Telegram linkről megnyitva is natív app élmény, 0 vízszintes csúszkálás.

---

## 🚀 Gyorsindítás lokálisan

```bash
# 1. Függőségek telepítése
npm install

# 2. Fejlesztői szerver indítása
npm run dev
```

> **💡 Megjegyzés:** Az alkalmazás azonnal működik **Supabase nélkül is** (ilyenkor a böngésző helyi tárolóját - `localStorage` - használja és előre feltöltött mintaadatokkal indul).

---

## ☁️ Supabase beállítása (Vercel élesítéshez)

Mivel a Vercel serverless környezetében a fájlrendszer törlődik, az éles megosztáshoz érdemes bekötni egy ingyenes Supabase adatbázist (2 perc):

1. Hozz létre egy ingyenes projektet a [supabase.com](https://supabase.com) oldalon.
2. Menj a bal oldali menüben az **SQL Editor** fülre.
3. Másold be és futtasd a `supabase/schema.sql` fájl tartalmát (vagy nyomj rá a *Run* gombra).
4. Menj a **Project Settings -> API** menüponthoz, és másold ki a:
   - `Project URL`
   - `anon public key`
5. Hozz létre egy `.env.local` fájlt a projekt gyökerében:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
6. Vercelen ugyanezt a két változót add meg a **Settings -> Environment Variables** alatt!

---

## 📦 Git és Vercel telepítés

```bash
# 1. Git commit
git add .
git commit -m "feat: Koli Piac v1.0 released"

# 2. Új GitHub repository létrehozása után:
git remote add origin https://github.com/FELHASZNALONEV/koli-piac.git
git branch -M main
git push -u origin main
```

Ezután a [vercel.com](https://vercel.com)-on válaszd az **Import Project** opciót, add meg a két Supabase környezeti változót, és másodpercek alatt kész az éles, megosztható link!

---

© 2026 [E-Brolo](https://ebrolo.hu/). Minden jog fenntartva.
