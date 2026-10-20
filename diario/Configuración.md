---
tags: [configuracion]
---
# Configuración

Web estática: `index.html`, `styles.css`, `script.js`. Sin variables de entorno.

- Despliegue: **Vercel**, proyecto `portfoliodsb` en `davidodo123s-projects`, conectado al repo (cada push a `main` se publica). URL: https://portfoliodsb.vercel.app. Web estática, sin build.
- Vercel distingue mayúsculas en los nombres de archivo: los enlaces deben coincidir exactamente (p. ej. `MiCV.pdf`).
- Ojo: las demos de las webs (TØP, Peru, Moi, Petside, Learnio, Skylander) siguen enlazando a `lightyellow-narwhal-328119.hostingersite.com`. Si se cancela Hostinger, esos enlaces dejan de funcionar.

## Demos de las webs
- GitHub Pages solo sirve archivos estáticos (HTML, CSS, JS, imágenes). No ejecuta PHP ni bases de datos.
- Estáticas, pueden ir a Pages: TØP (las `archives.php` y `contact.php` sueltas son plantillas sin usar), Peru, Moi, Skylander.
- No pueden: Petside (Laravel + BD) y Learnio (en local es un WordPress con plugins propios; el portfolio lo etiqueta como Laravel · Blade).
