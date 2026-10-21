# Reasons-first homepage

The welcome page now explains why players transfer to 1616 before they enter the application. It uses the approved cream/burgundy Reasons first design, with six benefits, prominent application buttons, the history link, and the existing application lookup and Boo support widget.

New copy is in `why1616-translations.js`, with the same 32 entries in all eight supported languages. Layout overrides are isolated in `why1616.css`. The application includes a Why 1616 navigation button; going back to the homepage preserves the draft. Returning from history still opens the saved application directly, with homepage handlers initialized for subsequent navigation.

Verified locally: desktop layout, 320px layouts in eight languages, Arabic RTL, application entry from header and hero, return to homepage, application lookup/back, Boo chat, history return, saved alliance draft across navigation and reload, unique DOM IDs, JavaScript syntax, and diff whitespace. No applications or support messages were submitted.

Moonlit Manor adds the selected plum and pumpkin-orange Halloween theme, Boo’s moonlit portrait, seasonal headings in all eight languages, and decorative icon tiles. Styles are scoped to the homepage in `moonlit-manor.css`. Verified 320px layouts across eight languages, hero image loading, application entry/return, application lookup/back, and Boo chat.
