import PopupCloseButton from "@lib/Popup/components/PopupCloseButton"
import { createStylesHook } from "@fet/theming"
import Surface from "@fet/contentContainers/Surface"
import Span from "@fet/Text/Span"

export type VotingPopupProps = {}

export default function DescriptionPopup() {
  const [ classes ] = useStyles()

  return (
    <Surface className={classes.popup}>
      <dl className={classes.defList}>
        <dt className={classes.listTitle}><Span highlight>Temat</Span></dt>
        <dd className={classes.listValue}>
          <p>Zgodność z tematem</p>

          <ol className={classes.list}>
            <li className={classes.listItem}><Span highlight>0</Span> - Temat nie jest dostrzegalny, lub jest niezwykle szczątkowy</li>
            <li className={classes.listItem}><Span highlight>1</Span> - Temat występuje przykładowo w tle, okala produkcję, gra jakoś nawiązuje do tematu</li>
            <li className={classes.listItem}><Span highlight>2</Span> - Temat został zaimplementowany w mechanikach dzieła, mechaniki są spójne z tematem a ich podmiana zupełnie by zmieniła produkt</li>
          </ol>
        </dd>

        <dt className={classes.listTitle}><Span highlight>Cecha</Span></dt>
        <dd className={classes.listValue}>
          <p>Zgodność z cechą</p>

          <ol className={classes.list}>
            <li className={classes.listItem}><Span highlight>0</Span> - Cecha jest niedostrzegalna, lub jest zaimplementowana niedbale</li>
            <li className={classes.listItem}><Span highlight>1</Span> - Cecha co do zasady została zachowana, być może pojawiły się drobne wątpliwości ale można uznać ze jest w porzadku</li>
            <li className={classes.listItem}><Span highlight>2</Span> - Cecha została uwzględniona w pełni, autor zauważalnie przyłożył uwagę do jej uwzględnienia</li>
          </ol>
        </dd>

        <dt className={classes.listTitle}><Span highlight>Wrażenia</Span></dt>
        <dd className={classes.listValue}>
          <p>Ogólne wrażenia. Wywołana ciekawość, chęć zobaczenia kontynuacji, element zaskoczenia, chęć powtarzania gry</p>

          <ol className={classes.list}>
            <li className={classes.listItem}><Span highlight>0</Span> - Monotonia, nuda, brak zaciekawienia odbiorcy, niechęć do przejścia całości lub przejscie z trudem</li>
            <li className={classes.listItem}><Span highlight>1</Span> - Powiewa deliaktną nudą, fajne ale nie rób więcej</li>
            <li className={classes.listItem}><Span highlight>2</Span> - Nic dodać nic ująć -- wartość domyślna, zaznacz jeśli nic szczególnie nie wpłynęło na Twoje wrażenia</li>
            <li className={classes.listItem}><Span highlight>3</Span> - Sympatyczna produkcja, wywołała przyjemne odczucia lub zachęciła do ponownej gry. Być może zagrałbyś w kontynuację lub wersję 2.0</li>
            <li className={classes.listItem}><Span highlight>4</Span> - Chcesz więcej, nawet jeśli było coś nie tak to nie ma to zestawienia z plusami. Bardzo przyjemna gra</li>
          </ol>
        </dd>

        <dt className={classes.listTitle}><Span highlight>Realizacja</Span></dt>
        <dd className={classes.listValue}>
          <p>Spójność produktu, dobrze dobrane wizualia</p>

          <ol className={classes.list}>
            <li className={classes.listItem}><Span highlight>0</Span> - Bez składu i ładu -- mało co do siebie pasuje.</li>
            <li className={classes.listItem}><Span highlight>1</Span> - Niektóre elementy do siebie nie pasują, całość nie współgra najlepiej</li>
            <li className={classes.listItem}><Span highlight>2</Span> - Nic dodać nic ująć -- wartość domyślna, zaznacz jeśli nic szczególnie nie wpłynęło na Twoje wrażenia</li>
            <li className={classes.listItem}><Span highlight>3</Span> - Dobrze dobrane elementy</li>
            <li className={classes.listItem}><Span highlight>4</Span> - Wszystko świetnie ze sobą współgra razem tworząc jedność</li>
          </ol>
        </dd>

        <dt className={classes.listTitle}><Span highlight>Czytelność</Span></dt>
        <dd className={classes.listValue}>
          <p>Czytelność i jasność zasad. Czy wiadomo co robić (jeśli błądzisz, czy wiesz o tym że czegoś szukasz)</p>

          <ol className={classes.list}>
            <li className={classes.listItem}><Span highlight>0</Span> - Niczego nie zrozumiałeś. Produkt niczego nie tłumaczy i bez pomocy autora nic nie zrobisz</li>
            <li className={classes.listItem}><Span highlight>1</Span> - Autor musi wyjaśnić drobne kwestie ale poza prostymi dopowiedzeniami produkt względnie się tłumaczy</li>
            <li className={classes.listItem}><Span highlight>2</Span> - Nikt nic nie musi dopowiadać. Jeśli tak się dzieje, to tylko w sytuacji rzeczy celowo ukrytych</li>
          </ol>
        </dd>
      </dl>

      <PopupCloseButton className={classes.closeButton} variant="outlined" body="Zamknij" />
    </Surface>
  )
}

const useStyles = createStylesHook( ({ atoms }) => ({
  popup: {
    width: `100vw`,
    height: `100vh`,
    overflow: `auto`,
    zIndex: 1000,
    backdropFilter: `blur( 30px )`,
  },

  defList: {
    padding: 0,
  },
  listTitle: {
    marginTop: atoms.spacing.main * 2,
  },
  listValue: {
    marginLeft: atoms.spacing.main,
  },

  list: {
    paddingLeft: atoms.spacing.main,
    listStyle: `none`,
    textIndent: -atoms.spacing.main,
  },
  listItem: {
    margin: `${atoms.spacing.main}px 0`,
  },

  closeButton: {
    justifyContent: `center`,
    width: `100%`,
  },
}) )
