# Rocket

![sovadina.dev logo](https://github.com/petrsovadina/rocket/blob/8453b7201112f875e972eff3f5b607170087d2aa/public/images/brand/sovadina.dev.svg)

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

3. Vytvořte soubor `.env.local` a nastavte potřebné proměnné prostředí (viz `.env.example`).

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

## Proměnné prostředí

Projekt vyžaduje následující proměnné prostředí:

- `OPENAI_API_KEY` - API klíč pro OpenAI
- `OPENAI_API_MODEL` - Název modelu OpenAI API
- `TAVILY_API_KEY` - API klíč pro Tavily
- `UPSTASH_REDIS_REST_URL` - URL pro Upstash Redis
- `UPSTASH_REDIS_REST_TOKEN` - Token pro Upstash Redis
- `MISTRAL_API_KEY` - API klíč pro Mistral AI

Tyto proměnné musí být nastaveny v souboru `.env.local` pro lokální vývoj nebo v prostředí pro produkční nasazení.

## Nasazení

Projekt je připraven pro nasazení na Vercel. Pro nasazení postupujte podle těchto kroků:

1. Vytvořte účet na [Vercel](https://vercel.com) a propojte jej s vaším GitHub účtem.
2. V Vercel dashboardu importujte váš projekt.
3. Nastavte všechny potřebné proměnné prostředí v Vercel dashboardu.
4. Spusťte nasazení.

Vercel automaticky rozpozná, že se jedná o Next.js projekt a nastaví správné build commands.

## Licence

Tento projekt je licencován pod Apache License 2.0. Více informací naleznete v souboru [LICENSE](LICENSE).

## Přispívání

Příspěvky jsou vítány! Pokud máte nápady na vylepšení nebo narazíte na nějaké problémy, neváhejte otevřít issue nebo pull request.

## Bezpečnost

Dbejte na to, abyste nikdy necommitovali soubor `.env` nebo jiné soubory obsahující citlivé informace do Git repozitáře. Vždy používejte `.env.example` jako šablonu pro nastavení proměnných prostředí a `.gitignore` pro vyloučení citlivých souborů z verzování.