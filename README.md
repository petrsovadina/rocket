# Rocket

Rocket je moderní webová aplikace využívající AI technologie pro vyhledávání a generování odpovědí.

## Technologie

Projekt je postavený na následujících hlavních technologiích:

- [Next.js](https://nextjs.org/) - React framework pro produkční prostředí
- [React](https://reactjs.org/) - JavaScriptová knihovna pro tvorbu uživatelských rozhraní
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Knihovna přístupných a nestavových UI komponent
- [AI SDK](https://sdk.vercel.ai/docs) - Sada nástrojů pro integraci AI modelů (OpenAI, Google AI, Anthropic)
- [Upstash Redis](https://upstash.com/) - Serverless Redis databáze
- [TypeScript](https://www.typescriptlang.org/) - Typový systém pro JavaScript

## Začínáme

Pro lokální spuštění projektu následujte tyto kroky:

1. Naklonujte repozitář:
   ```
   git clone https://github.com/your-username/rocket.git
   cd rocket
   ```

2. Nainstalujte závislosti:
   ```
   bun install
   ```

3. Vytvořte soubor `.env.local` a nastavte potřebné proměnné prostředí (viz `.env.local.example`).

4. Spusťte vývojový server:
   ```
   bun run dev
   ```

5. Otevřete [http://localhost:3000](http://localhost:3000) ve vašem prohlížeči.

## Dostupné skripty

- `bun run dev` - Spustí vývojový server s Turbo
- `bun run build` - Vytvoří produkční build
- `bun run start` - Spustí produkční server
- `bun run lint` - Spustí ESLint pro kontrolu kódu

## Licence

Tento projekt je licencován pod Apache License 2.0. Více informací naleznete v souboru [LICENSE](LICENSE).

## Přispívání

Příspěvky jsou vítány! Pokud máte nápady na vylepšení nebo narazíte na nějaké problémy, neváhejte otevřít issue nebo pull request.