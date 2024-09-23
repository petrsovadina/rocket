# 🚀 Rocket

AI-poháněný vyhledávač s generativním uživatelským rozhraním.

![snímek](https://github.com/petrsovadina/rocket/blob/71613e24c0d11c2510497b118d2a028337a29aed/public/brand/sovadina.dev.background.png)

> **POZNÁMKA**
> Vezměte prosím na vědomí, že projekt je stále ve vývoji a je to osobní siteprojekt 🙂

![snímek](https://github.com/petrsovadina/rocket/blob/2c99b9e3e694ce224662ea2d982557c7419f8588/public/brand/Rocket.jpeg)


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
- Primitivy bezhlavých komponent: [Radix UI](https://www.radix-ui.com/)
- Stylování: [Tailwind CSS](https://tailwindcss.com/)

## 🚀 Rychlý start

### 1. Forkněte a naklonujte repozitář

Forkněte repozitář na svůj Github účet a poté spusťte následující příkaz pro naklonování repozitáře:
