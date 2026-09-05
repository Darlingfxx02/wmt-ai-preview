# Обложки исследований

Исходные PNG: convergence-2027.png, quiet-replacement.png, ai-2025-2026.png.
Размер 900 × 1200 px. Замените нужную обложку и повторите экспорт мокапов:

    python scripts/render-research-books.py /path/to/6x9-standing-book-mockup-front-view-close-up.psd

Python-зависимости: pillow, numpy, psd-tools. Скрипт подставляет обложки в ракурс
PSD, сохраняет фотографические страницы и освещение и экспортирует WebP
в public/research-books/. Именно эти готовые изображения использует сайт.

Мокап: https://www.mockupidea.com/book/testing
Лицензия: https://www.mockupidea.com/licenses
Разрешены коммерческие итоговые изображения. Исходный PSD нельзя распространять
или размещать в public; его нужно самостоятельно скачать у автора.
