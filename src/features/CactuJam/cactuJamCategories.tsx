export type CactuJamCategoryNote = {
  value: number
  description: React.ReactNode
}

export type CactuJamCategory = {
  name: string
  scale: CactuJamCategoryNote[]
  label: string
  description: React.ReactNode
}

const cactuJamCategories:CactuJamCategory[] = [
  {
    label: `Temat`,
    name: `subject`,
    scale: [
      { value:0, description:<>Temat nie jest dostrzegalny, lub jest niezwykle szczątkowy</> },
      { value:1, description:<>Temat występuje przykładowo w tle, okala produkcję, gra jakoś nawiązuje do tematu</> },
      { value:2, description:<>Temat został zaimplementowany w mechanikach dzieła, mechaniki są spójne z tematem a ich podmiana zupełnie by zmieniła produkt</> },
    ],
    description: <>
      <p>Zgodność z tematem</p>
    </>,
  },
  {
    label: `Wrażenia`,
    name: `impressions`,
    scale: [
      { value:0, description:<>Monotonia, nuda, brak zaciekawienia odbiorcy, niechęć do przejścia całości lub przejscie z trudem</> },
      { value:1, description:<>Powiewa deliaktną nudą, fajne ale nie rób więcej</> },
      { value:2, description:<>Nic dodać nic ująć -- wartosć domyślna, zaznacz jeśli nic szczególnie nie wpłynęło na Twoje wrażenia</> },
      { value:3, description:<>Sympatyczna produkcja, wywołała przyjemne odczucia lub zachęciła do ponownej gry. Być może zagrałbyś w kontynuację lub wersję 2.0</> },
      { value:4, description:<>Chcesz więcej, nawet jeśli było coś nie tak to nie ma to zestawienia z plusami. Bardzo przyjemna gra</> },
    ],
    description: <>
      <p>Ogólne wrażenia. Wywołana ciekawosć, chęć zobaczenia kontynuacji, element zaskoczenia, chęć powtarzania gry</p>
    </>,
  },
  {
    label: `Realizacja`,
    name: `realisation`,
    scale: [
      { value:0, description:<>Bez składu i ładu -- mało co do siebie pasuje.</> },
      { value:1, description:<>Niektóre elementy do siebie nie pasują, całość nie współgra najlepiej</> },
      { value:2, description:<>Nic dodać nic ująć -- wartosć domyślna, zaznacz jeśli nic szczególnie nie wpłynęło na Twoje wrażenia</> },
      { value:3, description:<>Dobrze dobrane elementy</> },
      { value:4, description:<>Wszystko świetnie ze sobą współgra razem tworząc jedność</> },
    ],
    description: <>
      <p>Spójność produktu, dobrze dobrane wizualia</p>
    </>,
  },
  {
    label: `Czytelność`,
    name: `readability`,
    scale: [
      { value:0, description:<>Niczego nie zrozumiałeś. Produkt niczego nie tłumaczy i bez pomocy autora nic nie zrobisz</> },
      { value:1, description:<>Autor musi wyjaśnić drobne kwestie ale poza prostymi dopowiedzeniami produkt względnie się tłumaczy</> },
      { value:2, description:<>Nikt nic nie musi dopowiadać. Jeśli tak się dzieje, to tylko w sytuacji gdy z gry nie wynika że powinno się do czegos dojść samemu</> },
    ],
    description: <>
      <p>Czytelność i jasność zasad. Czy wiadomo co robić (jeśli błądzisz, czy wiesz o tym ze czegos szukasz)</p>
    </>,
  },
]

export default cactuJamCategories
