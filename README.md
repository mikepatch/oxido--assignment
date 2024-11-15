# Zadanie rekrutacyjne – Oxido

## 📑 Spis treści

1. [Opis projektu](#🚀-opis-projektu)
2. [Funkcjonalności](#🔧-funkcjonalności)
   - [Podstawowe wymagania](#podstawowe-wymagania)
   - [Bonusowa funkcjonalność](#bonusowa-funkcjonalność)
3. [Technologie](#🛠️-technologie)
4. [Instrukcja uruchomienia](#📝-instrukcja-uruchomienia)
5. [Możliwości rozwoju](#📈-możliwości-rozwoju)
6. [Struktura projektu](#📂-struktura-projektu)
7. [Uwagi](#📝-uwagi)
8. [Podziękowania](#🤝-podziękowania)

## 🚀 Opis projektu

Cześć!

Witaj w repozytorium mojego rozwiązania zadania rekrutacyjnego dla firmy Oxido. Stworzyłem aplikację, która łączy się z API OpenAI, aby przetworzyć artykuł tekstowy na semantyczny HTML. Moje podejście do tego zadania pokazuje, jak efektywnie można wykorzystać nowoczesne technologie do automatyzacji i optymalizacji procesów.

## 🔧 Funkcjonalności

### Podstawowe wymagania

1. **Konwersja tekstu na HTML**: Aplikacja wykorzystuje LLM do przekształcania surowego tekstu artykułu w dobrze ustrukturyzowany HTML, stosując odpowiednie tagi.
2. **Wzbogacenie HTML o obrazy**: Model LLM automatycznie identyfikuje miejsca, w których warto dodać grafiki, i wstawia odpowiednie znaczniki `<figure>`, `<img>` z atrybutami `alt`, oraz `<figcaption>` z podpisem zgodnym z kontekstem danej sekcji artykułu.
3. **Podgląd artykułu**: Dodatkowo, w ramach zadania dla chętnych, stworzyłem szablon HTML do wizualizacji artykułu, co pozwala na łatwą wizualizację rozwiązania.

### Bonusowa funkcjonalność

- **Generowanie obrazów**: Dzięki integracji z modelem DALL-E, aplikacja generuje pełną wersję artykułu wzbogaconą o obrazy wygenerowane na podstawie kontekstu danego fragmentu artykułu.

  - Obrazy są zapisywane w katalogu `images`, który jest tworzony lub odświeżany po każdym uruchomieniu aplikacji.
  - **Automatyczna zamiana obrazów**: W pliku `artykul.html`, wszystkie wystąpienia `image_placeholder.jpg` są automatycznie zamieniane na odpowiednie nazwy plików, takie jak `image-0.webp` zgodne z katalogiem `images/`.
  - Funkcjonalność ta jest opcjonalna i może być włączona w konfiguracji.

- **Automatyczna aktualizacja**: Katalog `images` oraz plik `artykul.html` są automatycznie aktualizowane przy każdym uruchomieniu aplikacji z aktywną opcją konfiguracyjną `enableBonusGeneratedImages`.
- **Połączenie klasycznego programowania i LLM**: W tym rozwiązaniu zastosowałem połączenie tradycyjnych technik programistycznych z wykorzystaniem modeli językowych (LLM), co pozwala na efektywne przetwarzanie i wzbogacanie treści artykułów.

**Zachęcam do uruchomienia i przetestowania tej funkcjonalności 😊** (orientacyjne koszty rozpisane są w sekcji [Uwagi](#📝-uwagi)).

## 🛠️ Technologie

- **TypeScript**: Główny język programowania użyty w projekcie.
- **OpenAI API**: Wykorzystane do przetwarzania tekstu i generowania obrazów.
- **Node.js**: Środowisko uruchomieniowe dla aplikacji.
- **DALL-E**: Model użyty do generowania obrazów.

## 📝 Instrukcja uruchomienia

### Wymagania

- **Node.js**: W wersji 18 lub wyższej.
- **NPM**: Zainstalowany wraz z Node.js.
- **Konto OpenAI**: Do uzyskania klucza API.

### Kroki uruchomienia

1. **Sklonuj repozytorium**:

   ```bash
   git clone https://github.com/mikepatch/oxido--assignment.git
   cd oxido--assignment
   ```

2. **Zainstaluj zależności**:

   ```bash
   npm install
   ```

3. **Skonfiguruj zmienne środowiskowe**:

   - Utwórz plik `.env` i uzupełnij go o wartość `OPENAI_API_KEY`:
     ```plaintext
     OPENAI_API_KEY=twoj_klucz_openai
     ```

4. **Uruchamianie**:

   - Aby uruchomić podstawową funkcjonalność wpisz w terminalu:
     ```bash
     npm run start
     ```
   - Aby uruchomić bonusową funkcjonalność generowania obrazów:
     - Ustaw `enableBonusGeneratedImages: true` w pliku `config.ts`.
     - Następnie uruchom:
       ```bash
       npm run start
       ```

5. **Wyniki**:
   - Wygenerowany plik HTML znajdziesz w `src/solution/artykul.html`. **Plik ten jest generowany automatycznie i nadpisywany przy każdym uruchomieniu aplikacji z wyłączoną opcją konfiguracyjną `enableBonusGeneratedImages`.**
   - Jeśli aktywujesz bonusową funkcję generowania obrazów, pełny podgląd artykułu z obrazami znajdziesz w `src/bonus-generating-images/podglad.html`. Następnie możesz skorzystać np. z Live Server do podglądu w przeglądarce internetowej.

## 📈 Możliwości rozwoju

- **Optymalizacja kosztów**: Implementacja mechanizmu ewaluacji odpowiedzi zwracanych przez modele, która umożliwia użycie słabszego modelu do przetwarzania danych i mocniejszego do oceny, redukując koszty (mocniejszy model zwracałby wyłącznie wartości 0 lub 1).
- **Skalowalność**: Rozszerzenie o metody przetwarzania bardzo długich artykułów poprzez wykorzystanie technik dzielenia dokumentów na mniejsze części (nowoczesne modele posiadają ogromne okna kontekstowe, ale jeśli zaszłaby taka potrzeba, można łatwo wdrożyć taką implementację).
- **Automatyzacja pobierania artykułów**: Wdrożenie mechanizmu pobierania surowych artykułów np. za pomocą CDN, co ułatwiłoby automatyzację procesu tworzenia wielu artykułów.

## 📂 Struktura projektu

Zorganizowałem projekt w sposób, który ułatwia jego rozwój i utrzymanie:

```
├── index.ts                     # Plik zarządzający uruchomieniem aplikacji
├── config.ts                    # Główny plik konfiguracyjny
└── src/
   ├── solution/                 # Obowiązkowe rozwiązanie
   │   ├── artykul.html          # Wygenerowany artykuł
   │   ├── podglad.html          # Strona z podglądem
   │   └── szablon.html          # Szablon HTML
   ├── bonus-generating-images/  # Funkcjonalność BONUS
   ├── features/                 # Główne funkcjonalności
   ├── services/                 # Serwisy (OpenAI, File, Image)
   ├── shared/                   # Współdzielone typy i utilities
   ├── prompts/                  # Prompty dla modeli AI
   └── example_raw_article.txt   # Przykładowy artykuł w formie surowego tekstu
```

## 📝 Uwagi

1. Koszty:
   - Rozwiązanie obowiązkowe: 0.02$ - 0.03$
   - Bonus: 0.18$ - 0.23$ (przy obecnym przykładowym artykule)
2. Do rozwiązania użyłem modelu GPT-4o, ale testowałem również model GPT-4o-mini i uzyskałem równie dobre rezultaty.

## 🤝 Podziękowania

Dziękuję za możliwość udziału w rekrutacji. Mam nadzieję, że moje rozwiązanie pokazuje moje umiejętności i zaangażowanie w tworzenie nowoczesnych aplikacji. Czekam na możliwość dalszej współpracy!
