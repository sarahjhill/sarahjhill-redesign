# Deploying

Two ways. Use the script — the manual commands are underneath it in case
anything ever goes wrong and you want to see what it is actually doing.

---

## One-time setup

Do this once, then never again.

### 1. Make the repository on GitHub

Go to [github.com/new](https://github.com/new).

- **Name:** `sjh-redesign` (or whatever you like)
- **Public** — GitHub Pages needs this on the free plan
- Do **not** tick "Add a README" — this folder already has one

Click **Create repository**.

### 2. Connect this folder to it

Open Terminal, `cd` into this folder, then run these one at a time.
Replace `sjh-redesign` if you named it something else.

```bash
git init
git branch -M main
git add .
git commit -m "First version"
git remote add origin https://github.com/sarahjhill/sjh-redesign.git
git push -u origin main
```

If it asks for a password, GitHub wants a **personal access token**, not your
account password — github.com → Settings → Developer settings → Personal access
tokens → Fine-grained tokens → Generate. Give it *Contents: read and write* on
this one repository. Paste the token where it asks for the password.

### 3. Turn Pages on

In the repository: **Settings → Pages → Source: Deploy from a branch →
`main` / `(root)` → Save**.

Two minutes later you are live at:

```
https://sarahjhill.github.io/sjh-redesign/
```

---

## Every time you change something

```bash
./deploy.sh "what I changed"
```

That is it. The script adds everything, commits with your message, pushes, and
tells you where to look. About 30–60 seconds later GitHub Pages has rebuilt.

First time only, make it runnable:

```bash
chmod +x deploy.sh
```

### The same thing by hand

```bash
git add .
git commit -m "what I changed"
git push
```

---

## Seeing changes before you push

No build step, so just open the file:

```bash
open index.html
```

For anything involving the JavaScript, run a little server instead — some
browser features are blocked on `file://` URLs:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. Stop it with `Ctrl + C`.

---

## Going live on sarahjhill.com

> **Careful.** A custom domain can only point at **one** repository. Right now
> `sarahjhill.com` belongs to the `make-it-pop` repo, which has a `CNAME` file
> in it. If two repos both claim the domain, the site breaks.

When you are ready, in this order:

1. **make-it-pop → Settings → Pages** → clear the custom domain field, Save.
2. In this repo, create a file called `CNAME` containing exactly one line:
   ```
   sarahjhill.com
   ```
3. **This repo → Settings → Pages → Custom domain** → `sarahjhill.com` → Save.
4. Wait for the certificate, then tick **Enforce HTTPS**. Can take an hour.

There is no rush. The `github.io` address works perfectly well while you decide.

---

## If a push is rejected

Means GitHub has a change your computer doesn't (usually because you edited a
file in the browser). Pull first, then push:

```bash
git pull --rebase
git push
```

## If the site doesn't update

- GitHub Pages takes a minute or two. Check **Actions** in your repo for a
  green tick.
- Then hard-refresh: **Cmd + Shift + R**. Browsers cache CSS aggressively.
