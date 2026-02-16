# Kompleksowy raport o PIT w Polsce w latach 2025–2026 z uwzględnieniem zaliczek, składek ZUS i zdrowotnej oraz KUP 50% (prawa autorskie)

## Streszczenie wykonawcze

W latach podatkowych 2025 i 2026 (stan na 16.02.2026) podstawowa konstrukcja PIT opodatkowanego według skali w entity["country","Polsce","country in europe"] obejmuje dwa progi: 12% do 120 000 zł podstawy obliczenia podatku oraz 32% od nadwyżki ponad 120 000 zł, przy kwocie zmniejszającej podatek 3 600 zł. citeturn41view6turn22search7turn22search8 Z tych parametrów wynika „kwota wolna” w sensie ekonomicznym 30 000 zł (bo 12% × 30 000 zł = 3 600 zł). citeturn41view6turn22search7

Rozliczenie wspólne małżonków polega na obliczeniu podatku od połowy łącznych dochodów i podwojeniu wyniku. W praktyce oznacza to m.in. „efektywny” próg wejścia w 32% przy łącznym dochodzie ok. 240 000 zł (2 × 120 000 zł) oraz podwojenie efektu kwoty wolnej. citeturn41view0

Zaliczki na PIT dzielą się na: (a) zaliczki pobierane przez płatników (np. pracodawców) zgodnie z zasadami poboru (w tym rozliczanie kwoty zmniejszającej w częściach 1/12, 1/24 lub 1/36 u maks. trzech płatników) oraz (b) zaliczki opłacane samodzielnie przez podatnika (np. działalność gospodarcza na skali) – co do zasady miesięcznie lub kwartalnie, z terminami do 20. dnia miesiąca po okresie rozliczeniowym i z rozliczeniem „narastająco” (podatek narastająco minus suma zaliczek). citeturn41view7turn41view10turn41view11

Składki na ubezpieczenia społeczne (ZUS) w typowych przypadkach pomniejszają dochód do opodatkowania (odliczenie od dochodu), o ile są zapłacone lub potrącone i nie dotyczą dochodów zwolnionych. citeturn41view4turn41view5 Składka zdrowotna co do zasady nie jest odliczana w PIT dla podatników na skali (w szczególności przedsiębiorców na skali); odliczenia/zaliczanie do kosztów dotyczą wybranych form opodatkowania działalności (np. liniowy, ryczałt, karta) i są limitowane. citeturn29search0turn29search13 Mechanika zdrowotnej dla przedsiębiorców jest określana w rozliczeniach ZUS (w tym minimalne podstawy i kwoty) i ulega zmianom między 2025 a 2026, m.in. w zakresie minimalnej podstawy dla części przedsiębiorców. citeturn31search5turn31search9

Koszty uzyskania przychodów 50% (KUP 50%) dla praw autorskich to kluczowy element optymalizacji dla twórców: liczone są co do zasady jako 50% przychodu (po pomniejszeniu o potrącone składki społeczne), ale roczny limit łącznych kosztów 50% jest powiązany z górną granicą pierwszego progu skali (w 2025/2026: 120 000 zł). citeturn41view2turn41view6turn45view0 Warunki praktyczne – zwłaszcza przy umowie o pracę – obejmują konieczność wyodrębnienia honorarium autorskiego, powstanie „utworu” oraz posiadanie obiektywnej dokumentacji potwierdzającej powstanie i przekazanie praw. citeturn42view2turn36view0

## Progi i stawki PIT w 2025 i 2026 oraz rozliczenie indywidualne i wspólne

Podstawą kalkulatora PIT na skali powinny być w aplikacji parametryzowane (wersjonowane po roku podatkowym) stałe: progi, stawki, kwota zmniejszająca, a także reguła wspólnego rozliczenia (dzielenie przez 2 i mnożenie podatku przez 2). citeturn41view6turn41view0

### Tabela: progi i stawki PIT 2025 vs 2026 (skala)

| Element | Rok podatkowy 2025 | Rok podatkowy 2026 | Uwagi implementacyjne |
|---|---:|---:|---|
| I próg (górna granica podstawy) | 120 000 zł citeturn41view6 | 120 000 zł (brak zmiany w przepisie skali – stan na 16.02.2026) citeturn41view6turn22search8 | Parametryzować, bo limit KUP 50% jest z nim sprzężony. citeturn41view2turn41view6 |
| Stawka I progu | 12% citeturn41view6 | 12% citeturn41view6turn22search8 | Stosowana do dochodu w I progu; w 32% wchodzi tylko nadwyżka. citeturn41view6 |
| Stawka II progu | 32% od nadwyżki > 120 000 zł citeturn41view6 | 32% od nadwyżki > 120 000 zł citeturn41view6turn22search8 | W rocznym wzorze: 10 800 zł + 32% nadwyżki. citeturn41view6 |
| Kwota zmniejszająca podatek | 3 600 zł citeturn41view6turn22search7 | 3 600 zł citeturn41view6turn22search8 | Dla płatników: obsługa 1/12, 1/24, 1/36 (PIT-2 / oświadczenia). citeturn41view7 |
| „Kwota wolna” (wynikowa) | 30 000 zł (12% × 30 000 = 3 600) citeturn41view6turn22search7 | 30 000 zł (w tym samym sensie wynikowym) citeturn41view6turn22search8 | To nie osobna „stawka”, tylko konsekwencja wzoru. W aplikacji warto pokazywać użytkownikowi jako interpretację. citeturn41view6 |

### Rozliczenie indywidualne vs wspólne

**Indywidualnie**: podatek liczony jest od podstawy obliczenia podatku według tabeli skali (12%/32%) i z uwzględnieniem kwoty zmniejszającej (w samym wzorze progu 12%). citeturn41view6

**Wspólnie z małżonkiem**: na wspólny wniosek w zeznaniu rocznym (PIT-36/PIT-37 zależnie od źródeł) małżonkowie mogą być opodatkowani łącznie od sumy dochodów; podatek określa się w podwójnej wysokości podatku obliczonego od połowy łącznych dochodów. citeturn41view0turn45view0

**Warunek czasowy małżeństwa**: przepis dopuszcza wspólność majątkową i małżeństwo przez cały rok, ale również od dnia zawarcia małżeństwa do końca roku, jeżeli ślub był w trakcie roku podatkowego. citeturn41view0

**Efektywny wpływ na progi**: ze względu na „połowienie” dochodu, 32% zaczyna działać dopiero powyżej ok. 240 000 zł łącznej podstawy małżonków (2 × 120 000 zł), o ile całość dochodów podlega opodatkowaniu skalą i kwalifikuje się do wspólnego rozliczenia. citeturn41view0turn41view6

**Ryzyko zmian**: w lutym 2026 r. pojawiają się publiczne informacje o projektach zmiany progu (np. propozycja 171 000 zł), ale na moment sporządzenia raportu nie jest to przepis obowiązujący; w aplikacji należy więc trzymać progi/stawki jako dane konfiguracyjne zależne od roku. citeturn22search6

## Zasady obliczania zaliczek na PIT oraz zaokrąglenia

Warstwa „zaliczek” jest w praktyce rozjazdem między podatkiem rocznym a podatkiem płaconym w trakcie roku. Dla aplikacji kluczowe jest modelowanie: (a) narastającego podatku rocznego, (b) zaliczek/pobrań dokonanych dotychczas, (c) różnicy do zapłaty/zwrotu. citeturn41view10turn41view11

### Zaliczki pobierane przez płatników (etat i podobne)

**Stawki zaliczek u pracodawcy**: dla dochodu pracownika liczonego narastająco u tego płatnika – 12% w miesiącach do przekroczenia 120 000 zł, a po przekroczeniu 32% dla kolejnych miesięcy (z zasadą „miesiąca przekroczenia” dzielonego na 12% i 32%). citeturn41view8

**Definicja „dochodu miesięcznego” do zaliczki u płatnika**: przychody z danego miesiąca pomniejsza się m.in. o koszty uzyskania przychodów (standardowe albo 50% KUP, jeśli stosowane) oraz o potrącone w danym miesiącu składki na ubezpieczenia społeczne. citeturn41view8turn41view9

**Kwota zmniejszająca w zaliczkach (PIT-2 / oświadczenie)**: płatnik pomniejsza zaliczkę co najwyżej o 1/12 kwoty zmniejszającej, przy czym podatnik może rozdzielić ją maksymalnie na trzech płatników (warianty 1/12, 1/24 lub 1/36). citeturn41view7

**Praktyczny problem wielu płatników**: w danym roku podatkowym przekroczenie 120 000 zł liczy się łącznie z różnych źródeł, ale każdy płatnik „widzi” tylko własne wypłaty; aplikacja powinna więc umożliwić symulację sumaryczną i wykryć ryzyko niedopłaty rocznej (np. dwóch pracodawców, każdy nie przekroczył 120 000 zł, ale łącznie podatnik przekroczył). citeturn41view8turn41view6

### Zaliczki opłacane samodzielnie (miesięczne i kwartalne)

**Mechanika narastająca**: podatnik samodzielnie wpłaca zaliczki miesięczne; zaliczka za dany okres to różnica między podatkiem należnym od dochodu osiągniętego od początku roku a sumą zaliczek za okresy poprzednie. citeturn41view10

**Moment powstania obowiązku wpłacania zaliczek (skala)**: obowiązek powstaje poczynając od miesiąca/kwartału, w którym dochody przekroczyły kwotę odpowiadającą ilorazowi kwoty zmniejszającej podatek i najniższej stawki podatku (dla parametrów 3 600 i 12% daje to 30 000 zł). citeturn41view10turn41view6

**Zaliczki kwartalne**: możliwość kwartalnych zaliczek dotyczy m.in. małych podatników oraz podatników rozpoczynających działalność (w zakresie wskazanym w ustawie) i opiera się na tej samej zasadzie różnicowej (podatek narastająco minus suma zaliczek), tylko rozliczanej kwartalnie. citeturn41view10turn41view11

**Terminy płatności**: zaliczki miesięczne wpłaca się do 20. dnia następnego miesiąca, kwartalne do 20. dnia miesiąca po kwartale; zaliczka za ostatni miesiąc/kwartał roku jest płatna do 20 stycznia następnego roku. citeturn41view11

**Próg 1 000 zł („nie wpłacam, jeśli mało wychodzi”)**: podatnicy mogą nie wpłacać zaliczki, jeśli podatek należny narastająco pomniejszony o sumę zaliczek wpłaconych narastająco nie przekracza 1 000 zł; po przekroczeniu – wpłacie podlega różnica. citeturn41view12turn31search10

### Zaokrąglenia w PIT i zaliczkach

Polska zasada ogólna: podstawy opodatkowania i kwoty podatków (oraz m.in. odsetki) zaokrągla się do pełnych złotych: końcówki < 50 gr pomija się, a końcówki ≥ 50 gr podwyższa się do pełnych złotych. citeturn42view0

Dla implementacji oznacza to, że aplikacja powinna:
- prowadzić obliczenia w groszach (lub w Decimal z 2 miejscami) do momentu finalizacji podatku/zaliczki,
- następnie stosować zaokrąglenie do pełnych złotych na „warstwie podatkowej” (podstawa podatku / podatek / zaliczka / dopłata-nadpłata), zgodnie z ww. regułą. citeturn42view0

## Składki na ubezpieczenia społeczne i zdrowotne a PIT w 2025 i 2026

W kalkulatorze PIT składki pełnią dwie role:
1) **składki społeczne** – zwykle obniżają dochód do opodatkowania (odliczenie od dochodu lub ujęcie jako koszt, zależnie od źródła i sposobu ewidencji),
2) **składka zdrowotna** – wpływa na „netto” i płynność, ale w skali PIT zasadniczo nie redukuje podatku (z istotnymi wyjątkami zależnymi od formy opodatkowania działalności). citeturn41view4turn41view5turn29search0turn29search13

### Składki społeczne (ZUS) – wpływ na podstawę opodatkowania

Podstawa obliczenia podatku (w skali) to dochód pomniejszony m.in. o składki określone w przepisach o systemie ubezpieczeń społecznych:
- zapłacone bezpośrednio na własne ubezpieczenia (emerytalne, rentowe, chorobowe, wypadkowe) podatnika i osób współpracujących,
- oraz potrącone przez płatnika ze środków podatnika (typowo: z wynagrodzenia). citeturn41view4turn41view5

Odliczenie nie dotyczy składek, których podstawę wymiaru stanowi dochód zwolniony od podatku (albo dochód, od którego zaniechano poboru). citeturn41view5

### Składka zdrowotna (NFZ) – co odlicza się w PIT, a czego nie

W praktyce PIT „na skali” (etat + działalność na zasadach ogólnych) **nie daje standardowego odliczenia składki zdrowotnej od podatku**. Najważniejsze odliczenia składki zdrowotnej dotyczą działalności gospodarczej opodatkowanej innymi reżimami (liniowy, ryczałt, karta) – wtedy istnieją reguły i limity. citeturn29search0turn29search13

Dla aplikacji oznacza to, że warto wprost rozdzielić logikę:
- `healthContribution.affectsTax = false` dla skali (typowo),
- `healthContribution.affectsTax = true` tylko wtedy, gdy użytkownik wybierze reżim, dla którego podatki.gov.pl przewiduje odliczenie (i wtedy trzeba wdrożyć limity i ścieżki odliczania). citeturn29search0turn29search13

### Zmiany i istotne parametry zdrowotnej 2025 vs 2026 z perspektywy danych wejściowych

Żeby kalkulator PIT był użyteczny „w realu”, powinien przynajmniej:
- umieć przyjąć składkę zdrowotną jako wejście (z payslip/ZUS),
- a opcjonalnie (dla przedsiębiorców) oferować moduł pomocniczy do policzenia minimalnej składki zdrowotnej i weryfikacji czy została spełniona. citeturn31search5turn31search9

Z punktu widzenia przedsiębiorców:
- ZUS publikuje informacje o podstawach i kwotach składki zdrowotnej na dany rok oraz o „roku składkowym” (m.in. 1 lutego – 31 stycznia) oraz o minimalnych podstawach dla wybranych grup. citeturn31search4turn31search5turn31search9  
- W 2026 r. ZUS wskazuje zmiany minimalnej podstawy wymiaru (m.in. dla opodatkowanych na zasadach ogólnych – minimalna podstawa jako element ograniczenia) oraz publikuje konkretne kwoty minimalne dla wybranych kategorii. citeturn31search5turn31search4  
- W 2025 r. ZUS prezentuje analogiczne informacje (w tym kwoty wynikające z 75% przeciętnego wynagrodzenia dla osób współpracujących oraz inne podstawy dla grup wskazanych w komunikacie). citeturn31search9

Dodatkowo przedsiębiorcy mają obowiązek rocznego rozliczenia składki zdrowotnej w dokumentach ZUS (DRA/RCA) – ZUS komunikował termin 20 maja (na przykładzie rozliczenia za 2024 r. w dokumencie za kwiecień 2025). citeturn31search0turn31search3  
W aplikacji PIT warto potraktować to jako kontekst (pomoc w kompletowaniu danych), ale nie mieszać tego z samym podatkiem, bo to odrębny reżim rozliczeniowy. citeturn31search0turn31search3

## KUP 50% od praw autorskich: kiedy przysługuje, limit, wpływ na zaliczki i rozliczenie roczne

### Podstawa prawna i mechanika obliczeń

Ustawa o PIT przewiduje 50% koszty uzyskania przychodów m.in. dla:
- korzystania przez twórców z praw autorskich i artystów wykonawców z praw pokrewnych lub rozporządzania przez nich tymi prawami. citeturn41view2turn45view0

Kluczowa technicznie reguła: **50% KUP liczy się od przychodu pomniejszonego o potrącone składki społeczne** (emerytalne/rentowe/chorobowe – w zakresie wskazanym w przepisie). citeturn41view2turn45view0  
Dla aplikacji to oznacza, że dla każdego okresu (miesiąc) trzeba znać: `copyright_gross` oraz `social_contrib_allocated_to_copyright`, bo podstawa KUP 50% jest „netto” po ZUS społecznych. citeturn41view2turn45view0

### Limity KUP 50% i relacja do progu skali

Roczny limit łącznych kosztów 50% (dla tytułów z art. 22 ust. 9 pkt 1–3) **nie może przekroczyć górnej granicy pierwszego przedziału skali**. citeturn41view2turn41view6  
Ponieważ w 2025/2026 górna granica I progu to 120 000 zł, to w typowej sytuacji limit kosztów 50% wynosi 120 000 zł rocznie. citeturn41view2turn41view6turn45view0

Oficjalne wyjaśnienie podatki.gov.pl podkreśla także, że jeśli podatnik **udowodni koszty faktycznie poniesione** wyższe niż wynikające z normy 50%, może przyjąć koszty faktyczne nawet powyżej limitu 120 000 zł – przy czym musi posiadać dokumenty potwierdzające wydatki. citeturn41view3turn45view0  
W aplikacji to sugeruje tryb `kupMode = "norma_50"` vs `kupMode = "koszty_faktyczne"` z osobnym walidowaniem. citeturn45view0turn41view3

### Katalog działalności i wyłączenia

Zastosowanie 50% KUP do praw autorskich jest ograniczone do wskazanych rodzajów działalności twórczej (katalog ustawowy), obejmujących m.in. programy komputerowe, gry komputerowe, działalność publicystyczną, twórczość audiowizualną, naukową itd. citeturn41view2turn41view3turn45view0turn36view0

Istotne wyłączenie dla kalkulatora: przepis przewiduje, że do przychodów z działalności gospodarczej (art. 14) **nie stosuje się** kosztów określonych w art. 22 ust. 9 (a więc także KUP 50%). citeturn41view3  
Praktycznie: przedsiębiorca na PKPiR/księgach rozlicza koszty „rzeczywiste”, a KUP 50% może dotyczyć np. wynagrodzeń autorskich poza działalnością (umowa, prawa majątkowe), zależnie od kwalifikacji źródła przychodu. citeturn41view3turn45view0

### Warunki stosowania KUP 50% w umowie o pracę i wymogi dowodowe

entity["organization","Ministerstwo Finansów","polish ministry of finance"] wydało interpretację ogólną (Dz. Urz. Min. Fin. poz. 107) dotyczącą stosowania 50% KUP do honorarium autorskiego. citeturn36view0turn42view2  
Z punktu widzenia implementacji i walidacji danych, najważniejsze wnioski praktyczne z interpretacji:

- honorarium autorskie może występować w ramach stosunku pracy lub umów cywilnoprawnych, ale **warunkiem jest powstanie utworu** będącego przedmiotem prawa autorskiego, citeturn42view2  
- płatnik/podatnik powinien dysponować **obiektywnymi dowodami** powstania utworu (interpretacja dopuszcza nawet oświadczenia pracodawcy i pracownika, jeżeli wskazują jaki utwór powstał), citeturn42view2  
- konieczne jest **wyraźne wyodrębnienie honorarium autorskiego** od innych składników wynagrodzenia. citeturn42view2  

Te punkty przekładają się na wymogi danych w aplikacji: nie wystarczy flaga `kup50=true`; potrzebne jest przynajmniej `copyrightIncomeAmount` (kwota honorarium) oraz informacja o sposobie jego ustalenia (np. procent/kwota stała/na podstawie ewidencji utworów), a także – w rekomendowanym trybie „compliance” – możliwość przypięcia metadanych utworów (tytuł/ID, data przyjęcia, pola eksploatacji). citeturn42view2turn45view0

### Orzecznictwo i sporne obszary, które warto uwzględnić w aplikacji

W praktyce spory koncentrują się na tym, czy dokumentacja pozwala powiązać honorarium z powstałymi utworami oraz czy nie jest to „automatyczne” przypisanie 50% KUP do całości pracy. Te kierunki są widoczne zarówno w interpretacji ogólnej (odwołania do cech utworu, rozróżnienie od działań rutynowych), jak i w doniesieniach o orzeczeniach. citeturn42view2turn42view2turn43search2

Jednocześnie w obiegu prawnym pojawia się istotna praktyczna teza: wymóg prowadzenia konkretnej ewidencji czasu pracy twórczej „co do zasady” nie wynika wprost z przepisów podatkowych, choć dokumentacja jako taka jest konieczna (tę linię przypisuje się m.in. wyrokowi NSA II FSK 422/17). citeturn43search2turn44search7  
W aplikacji oznacza to, że nie należy narzucać jednego formatu dowodu (np. timesheet), tylko zapewnić elastyczne warianty: lista utworów + protokoły przyjęcia, repozytorium commitów, oświadczenia, aneksy do umowy, itp., przy jednoczesnym komunikacie ryzyka, gdy honorarium nie jest wyodrębnione lub brak identyfikacji utworu. citeturn42view2turn45view0

## Przykłady obliczeń oraz wskazówki wdrożeniowe dla aplikacji

Poniższe przykłady służą implementacji algorytmów; kwoty składek są przyjmowane jako dane wejściowe (tak jak na pasku wynagrodzeń/ZUS), bo same składki wynikają z odrębnych reguł i mogą zależeć od limitów oraz statusu ubezpieczeniowego. citeturn41view4turn31search5

### Tabela: przykładowe obliczenia dla czterech scenariuszy (wartości przykładowe)

| Scenariusz | Założenia (wybrane) | Kluczowe kroki (skrót) | Wynik przykładowy (zaliczka / podatek) |
|---|---|---|---|
| Pracownik etatowy (skala) | przychód m-c 10 000 zł; składki społeczne potrącone 1 371,00 zł; KUP standard 250 zł; kwota zmniejszająca 300 zł (1/12); zdrowotna nie wpływa na PIT | dochód m-c = 10 000 − 1 371 − 250; zaliczka = 12% × dochód − 300; zaokrąglenie do zł | zaliczka ≈ 705 zł citeturn41view8turn41view7turn42view0 |
| Twórca na etacie z KUP 50% | przychód m-c 12 000 zł; honorarium autorskie 6 000 zł; składki społeczne potrącone 1 645,20 zł (alokacja 50/50); KUP 50% od (6 000 − 822,60); KUP standard 250 zł dla reszty; kwota zmniejszająca 300 zł | KUP50 = 50% × (6 000 − alok. ZUS); dochód = 12 000 − ZUS − (KUP50 + 250); zaliczka jak wyżej | zaliczka ≈ 602 zł (niższa vs brak KUP50) citeturn41view2turn41view8turn42view0turn42view2 |
| Działalność gosp. na skali – zaliczki miesięczne | dochód m-c (po kosztach i składkach społecznych) 18 400 zł; brak innych ulg; zdrowotna bez odliczenia w PIT | podatek narastająco wg art. 26+27; zaliczka = podatek narastająco − suma zaliczek; obowiązek po przekroczeniu progu wynikowego 30 000 | m-c 1: 0 zł; m-c 2: ok. 816 zł; m-c 3: ok. 2 208 zł citeturn41view10turn41view6turn41view4turn29search13 |
| Małżeństwo wspólnie | dochód roczny A=200 000 zł, B=0 zł; skala | indywidualnie: 10 800 + 32% × (200k−120k); wspólnie: 2 × (12% × 100k − 3 600) | indywidualnie ≈ 36 400 zł; wspólnie ≈ 16 800 zł citeturn41view6turn41view0turn42view0 |

### Przykłady krok po kroku

#### Pracownik etatowy (PIT wg skali, standardowe KUP)

1) **Wejście**: `przychód_brutto`, `składki_społeczne_potrącone`, `KUP_standard` (250 lub 300), `kwota_zmniejszająca_mies` (np. 300, jeśli 1/12), `zaliczki_pobrane_dotychczas`. citeturn41view1turn41view7turn41view8  
2) **Dochód do zaliczki u płatnika** = przychód m-c − KUP − składki społeczne potrącone. citeturn41view8turn41view9  
3) **Stawka** 12% lub 32% zależnie od przekroczenia 120 000 zł narastająco u płatnika. citeturn41view8turn41view6  
4) **Zaliczka** = stawka × dochód (z zasadą miesiąca przekroczenia) − pomniejszenie z art. 31b (1/12/1/24/1/36). citeturn41view7turn41view8  
5) **Zaokrąglenie** zaliczki do pełnych zł. citeturn42view0  

#### Twórca stosujący KUP 50% (umowa o pracę lub kontrakt)

1) **Wejście** musi rozdzielać: `honorarium_autorskie` vs `pozostałe_wynagrodzenie` oraz zawierać `składki_społeczne_potrącone` (i regułę ich alokacji). citeturn42view2turn41view2  
2) **Podstawa KUP 50%** = honorarium autorskie − składki społeczne przypisane do tego honorarium (praktycznie: alokacja proporcjonalna, jeśli płatnik tak robi). citeturn41view2turn45view0  
3) **KUP 50%** = 50% × (podstawa z pkt 2). citeturn41view2turn45view0  
4) **Limit roczny**: suma KUP50 narastająco ≤ 120 000 zł (w 2025/2026), chyba że podatnik rozlicza koszty faktyczne. citeturn41view2turn41view6turn45view0  
5) **Dochód do zaliczki** = (przychód całkowity − składki społeczne) − (KUP 50% + KUP standard dla części nieautorskiej, jeśli stosowane). citeturn41view2turn41view8  
6) **Warunki formalne** (dla trybu „kompatybilność”) – aplikacja powinna ostrzegać, jeśli brak wyodrębnienia honorarium lub brak dowodów powstania utworu. citeturn42view2turn36view0  

#### Działalność gospodarcza na zasadach ogólnych (skala) – zaliczka miesięczna/kwartalna

1) **Dochód z działalności** przyjmij jako wejście lub wylicz z ksiąg (przychody − koszty), następnie uwzględnij odliczenia od dochodu (np. składki społeczne), zgodnie z konstrukcją podstawy opodatkowania. citeturn41view4turn41view10  
2) **Podatek narastająco** oblicz według skali (art. 27) od podstawy narastającej. citeturn41view6turn41view10  
3) **Zaliczka za okres** = podatek narastająco − suma zaliczek wcześniej wpłaconych. citeturn41view10  
4) **Terminy**: do 20. dnia następnego miesiąca / miesiąca po kwartale; za ostatni okres do 20 stycznia. citeturn41view11  
5) **Próg 1 000 zł**: można pominąć wpłatę, jeśli różnica ≤ 1 000 zł (narastająco). citeturn41view12turn31search10  
6) **Składka zdrowotna**: dla skali traktuj jako obciążenie cash-flow bez odliczenia w PIT. citeturn29search13turn29search0  

#### Małżeństwo wspólnie

1) Zsumuj dochody obojga małżonków podlegające opodatkowaniu skalą. citeturn41view0turn41view6  
2) Podziel przez 2. citeturn41view0  
3) Oblicz podatek od połowy według skali. citeturn41view6  
4) Pomnóż wynik ×2. citeturn41view0  
5) Odejmij zaliczki/pobrania wykazane w informacjach (PIT-11 i inne) i rozlicz dopłatę/zwrot. citeturn45view0turn42view0  

### Tabela: pola wejściowe/wyjściowe API i formaty danych (propozycja)

| Pole | Typ | Opis | Uwagi |
|---|---|---|---|
| `taxYear` | int | 2025 albo 2026 | Wersjonuje progi/limity. citeturn41view6 |
| `filingMode` | enum | `single` / `joint` | `joint` uruchamia algorytm art. 6 (połowa i ×2). citeturn41view0 |
| `incomes[]` | array | Lista źródeł przychodów | Każde źródło ma własne reguły KUP i zaliczek. citeturn41view8turn41view10 |
| `incomes[].type` | enum | `employment`, `copyright`, `business_scale`, … | Rozdzielić co najmniej te 4 scenariusze. citeturn45view0turn41view3 |
| `incomes[].gross` | decimal(2) | Przychód brutto okresu lub roku | Dla etatu/umów – z PIT-11 lub paska. citeturn45view0 |
| `incomes[].socialContrib` | decimal(2) | Składki społeczne potrącone/zapłacone | Wpływ na podstawę PIT i na bazę KUP 50%. citeturn41view4turn41view2 |
| `incomes[].healthContrib` | decimal(2) | Składka zdrowotna | Zwykle bez odliczenia na skali. citeturn29search13turn29search0 |
| `incomes[].kupMode` | enum | `standard_employee`, `kup50`, `actual_costs`, `none` | `kup50` wymaga dodatkowych pól. citeturn41view2turn45view0 |
| `incomes[].copyrightHonorarium` | decimal(2) | Część przychodu kwalifikowana do KUP 50% | Krytyczne dla zgodności. citeturn42view2turn41view2 |
| `advances.paid[]` | array | Zaliczki pobrane/wpłacone | Rozliczenie roczne = podatek − suma zaliczek. citeturn41view10turn42view0 |
| **Wyjście** `result.monthlyAdvance` | decimal(0) | Zaliczka za miesiąc (po zaokrągleniu) | Zaokrąglenie do zł. citeturn42view0 |
| **Wyjście** `result.quarterlyAdvance` | decimal(0) | Zaliczka za kwartał (po zaokrągleniu) | Termin do 20. następnego miesiąca. citeturn41view11 |
| **Wyjście** `result.annualTax` | decimal(0) | Podatek roczny należny | Skala + wspólne rozliczenie według art. 6. citeturn41view6turn41view0 |
| **Wyjście** `result.balance` | decimal(0) | `annualTax − sum(advances)` | Dodatnie = dopłata, ujemne = nadpłata. citeturn42view0 |

Przykładowy (minimalny) payload JSON do testów integracyjnych:

```json
{
  "taxYear": 2025,
  "filingMode": "single",
  "incomes": [
    {
      "type": "employment",
      "gross": 10000.00,
      "socialContrib": 1371.00,
      "healthContrib": 776.61,
      "kupMode": "standard_employee",
      "kupAmount": 250.00,
      "taxReliefShare": "1/12"
    }
  ],
  "advances": {
    "paid": [
      { "period": "2025-01", "amount": 705 }
    ]
  }
}
```

### Testy jednostkowe i przypadki brzegowe

W aplikacji PIT testy powinny odzwierciedlać granice prawne i typowe „rozjazdy” praktyczne:

- **Granice progów**: dokładnie 30 000 zł (efekt kwoty wolnej), dokładnie 120 000 zł oraz minimalne przekroczenia (120 000,01 zł po zaokrągleniach). citeturn41view6turn41view10turn42view0  
- **Wspólne rozliczenie**: przypadek „A=200k, B=0”, przypadek „A=130k, B=110k” (wspólnie = 240k, granica wejścia w 32%). citeturn41view0turn41view6  
- **Zaokrąglanie**: wartości kończące się na 0,49 zł i 0,50 zł na poziomie podatku/zaliczki. citeturn42view0  
- **KUP 50% limit**: narastająco osiągnięcie 120 000 zł kosztów w listopadzie i wyłączenie KUP 50% w kolejnych wypłatach (przełączenie na KUP standard / brak normy 50%). citeturn41view2turn41view6turn45view0  
- **KUP 50% warunki formalne**: honorarium autorskie = 0 (a flaga KUP 50% włączona) → błąd/warning; brak rozdziału honorarium od reszty → warning compliance. citeturn42view2  
- **Wielu płatników**: dwie umowy o pracę z zastosowaniem pomniejszenia 1/12 u obu (błąd, bo suma powinna odpowiadać 1/12 w miesiącu) vs poprawne 1/24 + 1/24. citeturn41view7  
- **Zaliczki samodzielne i próg 1 000 zł**: dział. gosp. – brak wpłaty przez kilka okresów, potem „skok” po przekroczeniu. citeturn41view12  

### Diagram przepływu obliczeń (mermaid)

```mermaid
flowchart TD
  A[Wejście: przychody i typy źródeł] --> B[Ustalenie KUP: standard / 50% / faktyczne]
  B --> C[Odliczenia od dochodu: składki społeczne itd.]
  C --> D[Podstawa opodatkowania roczna (suma źródeł na skali)]
  D --> E{Tryb rozliczenia}
  E -->|single| F[Podatek wg skali]
  E -->|joint| G[Podatek = 2 * (skala od połowy podstawy)]
  F --> H[Saldo = podatek - suma zaliczek/pobrań]
  G --> H
  H --> I[Wyjście: podatek roczny, dopłata/zwrot, zaliczki okresowe]
```

### Priorytetowe źródła użyte w raporcie (wplecione w tekst)

Najważniejsze dokumenty źródłowe, na których oparto parametry i reguły implementacyjne, to:
- jednolity tekst ustawy o PIT (kluczowe: art. 6 – wspólne rozliczenie; art. 22 – KUP standard i 50%; art. 26 – odliczenia składek społecznych; art. 27 – skala; art. 31b–32 – pomniejszenia i pobór zaliczek przez płatników; art. 44 – zaliczki samodzielne), citeturn41view0turn41view1turn41view2turn41view4turn41view6turn41view7turn41view10turn41view11turn41view12  
- Ordynacja podatkowa (zaokrąglenia – art. 63), citeturn42view0  
- oficjalne wyjaśnienia i przewodniki na podatki.gov.pl (m.in. prawa autorskie i KUP 50%, formularze i terminy), citeturn45view0turn31search14turn29search0turn22search8  
- interpretacja ogólna entity["organization","Krajowa Administracja Skarbowa","polish revenue administration"] / entity["organization","Ministerstwo Finansów","polish ministry of finance"] dotycząca honorarium autorskiego i KUP 50% (Dz. Urz. Min. Fin. poz. 107), citeturn36view0turn42view2  
- komunikaty entity["organization","Zakład Ubezpieczeń Społecznych","warsaw, poland"] dotyczące podstaw i kwot składki zdrowotnej (2025/2026) oraz rocznego rozliczenia zdrowotnej, citeturn31search5turn31search9turn31search0turn31search3  
- ostrzegawczo (orzecznictwo w ujęciu praktycznym): materiały wskazujące na kierunki judykatury dot. dokumentowania i wyodrębniania honorarium (np. II FSK 422/17 przywoływany w interpretacji ogólnej). citeturn44search7turn43search2