---
tags: [decisiones]
---
# Decisiones

## Quitar Servicios y Estilo
*2026-10-20* — David pide eliminar las secciones Servicios (tipos de web y precios) y Estilo (paletas favoritas). Se borran el HTML, el enlace "Servicios" del menú y todo su CSS (incluidas media queries). Copia previa de `index.html` y `styles.css` no versionada (la carpeta no es repo git).

## Proyectos en dos niveles: apps y webs
*2026-10-20* — Eat-em y Run-In-Out son mucho más grandes que las webs, así que van arriba como fichas grandes (descripción, funciones, cifras, stack, enlace a la app y al código, móvil con captura). Las webs siguen debajo con el carrusel de siempre, ahora con el título "Webs para negocios". Alternativa descartada: meterlas como dos diapositivas más del carrusel (quedaban al mismo nivel que las webs y sin sitio para explicar nada).

## Web orientada a empresas
*2026-10-20* — La web se dirige a empresas que contratan, no a clientes. Se quitan los mensajes de captar clientes, la insignia pasa a "Abierto a ofertas · Granada", el rol a "Desarrollador full-stack · IA" y el CV gana protagonismo. Fuentes nuevas: Archivo (titulares), Instrument Sans (texto), JetBrains Mono (etiquetas). Se conserva la paleta, el cubo, el reloj y la estructura. Alternativa descartada: mantener el enfoque de webs para negocios.

*2026-10-20 (después)* — Probado el v0 y **revertido**: a David le gustaba más como estaba. Se vuelve al diseño con la sección de Apps. El público sigue siendo empresas, pero sin tocar el diseño por ahora.

## Paleta blanco roto y azul eléctrico
*2026-10-20* — David pide blanco roto y azul eléctrico. Elegida entre 4 combinaciones: fondo blanco roto `#f3f0e8`, titulares negro tinta `#0e0e12`, acento azul eléctrico `#2b3bff`. Descartadas: con amarillo ácido, versión oscura azul noche y con el naranja de antes. El cubo sigue con marco oscuro y pegatinas azul/blanco. Eat-em y Run-In-Out mantienen su color propio dentro de su ficha (oscurecido para que se lea sobre claro).

## Despliegue en Vercel
*2026-10-20* — El portfolio se publicará en Vercel en lugar de Hostinger, como Eat-em y Run-In-Out.

## Webs en GitHub Pages y fuera Hostinger
*2026-10-20* — Las demos estáticas (TØP, Peru, Moi, Skylander) pasan a GitHub Pages. Petside y Learnio se quitan del portfolio porque necesitan PHP y base de datos. David también quita el título "¿Tu negocio necesita una web?" de Contacto (la web ya no se dirige a clientes). Pendiente: TalentHub depende del WordPress de Hostinger (`cms.damen.sbs`).

## Portada: terminal y red neuronal
*2026-10-20* — Se quita el cubo de Rubik. Probadas 3 opciones en vivo (terminal, apps flotando, red neuronal); a David le gustan la terminal y la red, así que se combinan: red de puntos animada de fondo (reacciona al ratón) y encima una terminal que teclea comandos de sus proyectos. Descartada: móviles flotando (las capturas actuales son de la pantalla de entrada). Oculta en tablet/móvil, quieta con "reducir movimiento".

## Webs en mazo de cartas
*2026-10-20* — Idea de David: las webs como tarjetas apiladas. La de delante se pasa al pulsarla (no el botón "Ver proyecto"), sale girando y va al fondo; las otras asoman por arriba. También flechas ← → (botones y teclado). Sustituye al scroll fijo de 4 pantallas. En móvil el texto va debajo de la imagen: arregla de paso que el nombre se pisara con la captura.

## Optimización de rendimiento
*2026-10-20* — La web cargaba ~9,9 MB al entrar (capturas PNG de hasta 5,6 MB). Se pasan a WebP a 1600px (las de las webs) y 600px (las de las apps): ~0,4 MB al entrar y ~0,8 MB tras recorrer toda la página. Además: imágenes con `loading="lazy"` y tamaño fijo, iconos de Font Awesome sin bloquear el pintado, red neuronal y terminal en pausa cuando la portada no se ve, scroll y ratón limitados a un cálculo por frame, y el mazo oscurece con una capa en vez de `filter`. Los PNG originales siguen en la carpeta pero la web ya no los usa.

## Run-In-Out con sus colores
*2026-10-26* — La app cambió a negro y lima (estilo Volt). Su ficha del portfolio deja el naranja y pasa a fondo negro con acento lima (clase `app-volt`, solo redefine variables dentro de la tarjeta). Alternativa: solo cambiar el acento a lima sobre el fondo claro — descartada porque el lima no se lee sobre blanco roto.
