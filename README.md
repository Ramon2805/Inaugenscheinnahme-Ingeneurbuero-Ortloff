# Inaugenscheinnahme-App

Diese Seite kann einfach über GitHub Pages veröffentlicht werden.

## Veröffentlichung

1. Erstelle auf GitHub ein neues Repository, zum Beispiel mit dem Namen `inaugenscheinnahme-app`.
2. Lade die Dateien dieses Ordners in das Repository hoch.
3. Öffne das Repository auf GitHub und gehe zu Settings → Pages.
4. Wähle unter Source die Option „Deploy from a branch“.
5. Wähle als Branch `main` und als Ordner `/root`.
6. Speichere die Einstellung.
7. Nach wenigen Minuten erscheint die öffentliche URL in der Form:
   `https://dein-username.github.io/inaugenscheinnahme-app/`

## GitHub-Repository anlegen

1. Öffne GitHub und klicke auf „New repository“.
2. Gib als Namen `inaugenscheinnahme-app` ein.
3. Wähle „Public“ oder „Private“ je nach Wunsch.
4. Klicke auf „Create repository“.

## Dateien hochladen

Öffne in dem Ordner mit der App ein Terminal und führe diese Befehle aus:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/inaugenscheinnahme-app.git
git push -u origin main
```

## GitHub Desktop-Variante

Wenn du GitHub Desktop bevorzugst:

1. Öffne GitHub Desktop.
2. Wähle „Add an existing repository from your computer“.
3. Wähle den Ordner [c:\Users\Tashe\Documents\inaugenscheinnahme-app](c:\Users\Tashe\Documents\inaugenscheinnahme-app) aus.
4. Klicke auf „Publish repository“.
5. Wähle den Reponamen `inaugenscheinnahme-app` und veröffentliche ihn.

## GitHub Pages aktivieren

1. Öffne dein Repository auf GitHub.
2. Gehe zu Settings → Pages.
3. Wähle unter Source „Deploy from a branch“.
4. Wähle `main` als Branch und `/root` als Ordner.
5. Speichere die Einstellung.

Nach kurzer Zeit erscheint deine öffentliche URL in dieser Form:

```text
https://DEIN-USERNAME.github.io/inaugenscheinnahme-app/
```
