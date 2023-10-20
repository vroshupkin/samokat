# Структура проекта

Если в проекте нет .clasp.json, то добавить его. Добавляет id продакшена

```javascript
{
    "scriptId":"1ZR_43r8FeZGszyegHFrUT6epp3DB0_64oZ9x15HmQ025pc8fk97F8d59",
    "rootDir":"./src"
}

```

src/Menu.js - Все кастомные меню google sheets

src/Triggres.js -Все триггеры проекта

src/Triggres.js - Название таблиц и цвета

Элементы для внутреннего использования обозначены - "_name"

# Getting started

npm i -g clasp			- Глобальная установка clasp, если его нет

npm i 				- Установка зависимостей проекта

[Eslint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - расширение eslint для авторедактирования

## Dicoqs

Библиотека для цензуры находится ./src/badwords.js

_badword_reg_ex_ru - регулярное выражение для обработки русских слов
