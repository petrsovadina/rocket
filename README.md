# Morphic

AI-poháněný vyhledávač s generativním uživatelským rozhraním.

![snímek]([/public/capture-240404_blk.png](https://github.com/petrsovadina/rocket/blob/d3c4012cb985c2f03e000593f8fcc3721c781e01/public/brand/logo-long.svg))

> [!POZNÁMKA]
> Vezměte prosím na vědomí, že existují rozdíly mezi tímto repozitářem a oficiální webovou stránkou [morphic.sh](https://morphic.sh). Oficiální webová stránka je fork tohoto repozitáře s dalšími funkcemi, jako je autentizace, které jsou nezbytné pro poskytování služby online. Základní zdrojový kód Morphicu se nachází v tomto repozitáři a je navržen tak, aby se dal snadno sestavit a nasadit.

## 🗂️ Přehled

- 🛠 [Funkce](#-funkce)
- 🧱 [Technologie](#-technologie)
- 🚀 [Rychlý start](#-rychlý-start)
- 🌐 [Nasazení](#-nasazení)
- 🔎 [Vyhledávač](#-vyhledávač)
- ✅ [Ověřené modely](#-ověřené-modely)

## 🛠 Funkce

- Vyhledávání a odpovídání pomocí GenerativeUI
- Porozumění otázkám uživatele
- Funkce historie vyhledávání
- Sdílení výsledků vyhledávání ([Volitelné](https://github.com/miurla/morphic/blob/main/.env.local.example))
- Podpora vyhledávání videa ([Volitelné](https://github.com/miurla/morphic/blob/main/.env.local.example))
- Získávání odpovědí z určených URL
- Použití jako vyhledávač [※](#-vyhledávač)
- Podpora pro poskytovatele jiné než OpenAI
  - Google Generative AI Provider
  - Anthropic Provider [※](https://github.com/miurla/morphic/pull/239)
  - Ollama Provider ([Nestabilní](https://github.com/miurla/morphic/issues/215))
- Specifikace modelu pro generování odpovědí
  - Podpora Groq API [※](https://github.com/miurla/morphic/pull/58)

## 🧱 Technologie

- Aplikační framework: [Next.js](https://nextjs.org/)
- Streamování textu / Generativní UI: [Vercel AI SDK](https://sdk.vercel.ai/docs)
- Generativní model: [OpenAI](https://openai.com/)
- Vyhledávací API: [Tavily AI](https://tavily.com/) / [Serper](https://serper.dev)
- Reader API: [Jina AI](https://jina.ai/)
- Serverless databáze: [Upstash](https://upstash.com/)
- Knihovna komponent: [shadcn/ui](https://ui.shadcn.com/)
- Primitivy bezhlav

ých komponent: [Radix UI](https://www.radix-ui.com/)
- Stylování: [Tailwind CSS](https://tailwindcss.com/)

## 🚀 Rychlý start

### 1. Forkněte a naklonujte repozitář

Forkněte repozitář na svůj Github účet a poté spusťte následující příkaz pro naklonování repozitáře:
