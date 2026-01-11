# Changelog

## [3.1.1] - The "Clean Slate" Update / Обновление "Чистый Лист"

### 🇬🇧 English
**Code Hygiene & Performance:**

- **Audio Intelligence**: 
    - Fixed a frustrating bug where the volume would reset when switching tracks.
    - Switched to **Global Volume Management**. Now your volume settings are strictly enforced across the entire app session.
    - Improved **Crossfade Reliability**. Transitioning between tracks is now smoother than butter, thanks to better state tracking (Refs).
- **Under the Hood**: Refactored core playback logic to avoid "stale state" issues. The app now always knows exactly what your settings are, even in the middle of a track skip.

### 🇷🇺 Русский
**Чистота и Производительность:**

- **Умный Звук**:
    - Починил бесячий баг, когда громкость сбрасывалась при переключении на следующий трек.
    - Перешел на **Глобальное Управление Громкостью**. Теперь настройки громкости применяются ко всему приложению сразу и не "прыгают".
    - Улучшил **Надежность Кроссфейда**. Переходы между песнями стали еще плавнее благодаря исправлению логики отслеживания состояния.
- **Под Капотом**: Оптимизировал логику плеера, чтобы исключить задержки и ошибки в определении текущих настроек при быстрой смене треков.

---

## [3.1.0] - Major UI Update / Основное обновление интерфейса

### 🇬🇧 English
**New Player Experience:**
- **Big & Bold**: The Player tab now dominates 2/3 of the screen. I gave the artwork room to breathe because nobody likes looking at postage stamps.
- **Queue on Steroids**: The "Up Next" queue now spans the *entire* width of the screen. No more squinting at a tiny list in the corner like it's naughty.
- **Real Controls**: 
    - Added a **Volume Slider** (finally!). Your eardrums are welcome.
    - Swapped the weird "pill" button for a classic **Heart Icon**. Because pills are for headaches, hearts are for vibes.
- **Menu Intelligence**: The gear menu now opens **UPWARDS**. I taught it that the bottom of the screen exists and it shouldn't try to hide below it. Also gave it a solid background so it stops looking like a ghost.

**Navigation & Usability:**
- **Mouse Powers**: You can now use your mouse's Back/Forward side buttons to navigate. Welcome to 2026, where we support gaming mice.
- **Localization**: Added missing English strings. Now the app speaks full sentences.

**Bug Splatting:**
- **The Pancake Button**: The play button kept getting squashed into an oval. I fed it some css steroids (`flex-shrink: 0`) and now it's a perfect circle again.
- **The "Invisible Queue"**: Fixed a bug where the queue refused to load because I was calling a function that lived only in my imagination (`getContextQueue`). Fixed that hallucination.
- **Code Hygiene**: Cleaned up some accidental copy-paste disasters. It happens to the best of us.

---

### 🇷🇺 Русский
**Новый Плеер:**
- **Гига-Плеер**: Вкладка плеера теперь занимает 2/3 экрана (65vh). Обложка огромная, всё красиво. Теперь можно рассмотреть каждый пиксель артворка.
- **Очередь-Батя**: Список "Далее" (Up Next) теперь растянут на всю ширину экрана. Хватит ютиться в уголке, места хватит всем.
- **Управление для Людей**:
    - **Ползунок Громкости**: Наконец-то можно сделать потише, не ломая пальцы. (Стрелочка вниз)
    - **Сердечко**: Убрал странную кнопку-таблетку, вернул православное сердечко. Лайкать стало приятнее.
- **Меню с IQ**: Меню настроек теперь открывается **ВВЕРХ**. Я объяснил ему, что снизу экран заканчивается, и падать туда не надо.

**Навигация и Удобство:**
- **Геймерская Навигация**: Боковые кнопки мыши (Назад/Вперед) теперь РАБОТАЮТ. Твоя мышь за 10к наконец-то окупила себя.
- **Перевод**: Доперевел всё, что забыл. Приложение больше не притворяется иностранцем.

**Убийство Багов:**
- **Блинчик Play**: Кнопка Play больше не превращается в овал при сжатии окна. Она теперь круглая и гордая.
- **Где Очередь?**: Починил баг, когда очередь не грузилась, потому что я вызывал несуществующую функцию (бывает, чё). Теперь всё работает.
- **Уборка**: Вымел мусор из кода, убрал лишние скобки и дубликаты. Код блестит.
