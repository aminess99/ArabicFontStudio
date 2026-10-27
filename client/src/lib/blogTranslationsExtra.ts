// English and French versions of the how-to and reference articles written
// after blogPostTranslations.json was generated. Links point to the page in
// the same language.

type Translation = { title: string; excerpt: string; content: string };

export const extraBlogTranslations: Record<string, { en: Translation; fr: Translation }> = {
  "hal-mushkilat-alhoroof-almuqatta-photoshop": {
    en: {
      title: "Arabic Letters Broken or Reversed in Photoshop: Cause and Fix",
      excerpt: "Why Arabic letters show up separated or left to right in Photoshop and Illustrator, and how to turn on the Middle Eastern text engine to fix it.",
      content: `You type an Arabic word in Photoshop and the letters appear separated and reversed: "د م ح م" instead of "محمد". The font is rarely the problem; the text engine is.

## Why the letters break apart

Arabic letters change shape depending on their position in a word, and the text runs from right to left. The default text engine in Adobe apps is built for Latin scripts, so it neither joins the letters nor reverses the direction. The fix is to switch to the engine for Middle Eastern and South Asian languages.

## Fix in Photoshop

1. Open **Edit → Preferences → Type** (on Mac: **Photoshop → Settings → Type**).
2. Under **Choose Text Engine Options**, select **Middle Eastern and South Asian**.
3. Click **OK**, then **quit and reopen Photoshop**; the change only applies after a restart.
4. Create a new text layer and type the Arabic text. Older layers may need to be retyped.
5. In the **Paragraph** panel menu, choose **Middle Eastern and South Asian Every-line Composer** and set the paragraph direction to right-to-left.

## Fix in Illustrator

1. Open **Edit → Preferences → Type** and enable the Middle Eastern and South Asian options.
2. In the **Paragraph** panel menu, choose **Middle Eastern & South Asian Every-line Composer**.
3. Set the paragraph direction to right-to-left.

## Fix in After Effects

Open **Preferences → Type**, choose **South Asian and Middle Eastern** as the text engine, then restart the app.

## Still broken?

- **The font has no Arabic letters:** many Latin fonts lack Arabic glyphs, so the app substitutes another font or shows boxes. Pick an Arabic font from the [font library](/en) and check that its preview shows the letters.
- **Very old version:** older releases needed a special "ME" edition. Update to a recent version.
- **Text pasted from a website:** hidden direction marks can come along. Type the text directly or paste it as plain text.
- **Apps with no Arabic support at all:** write the text in the [Arabic font generator](/en/arabic-font-generator), download a transparent PNG and place it on your design.

## Summary

In most cases switching the text engine to **Middle Eastern and South Asian** and restarting the app is enough. If the problem remains, check that the font itself supports Arabic.

## References

- [Arabic and Hebrew type in Photoshop — Adobe](https://helpx.adobe.com/photoshop/using/arabic-hebrew-type.html)
- [Arabic and Hebrew type in Illustrator — Adobe](https://helpx.adobe.com/illustrator/using/arabic-hebrew-type.html)`,
    },
    fr: {
      title: "Lettres arabes séparées ou inversées dans Photoshop : la solution",
      excerpt: "Pourquoi les lettres arabes s'affichent séparées ou de gauche à droite dans Photoshop et Illustrator, et comment activer le moteur de texte moyen-oriental.",
      content: `Vous tapez un mot arabe dans Photoshop et les lettres apparaissent séparées et inversées : « د م ح م » au lieu de « محمد ». Le problème vient rarement de la police, mais du moteur de texte.

## Pourquoi les lettres se séparent

Les lettres arabes changent de forme selon leur position dans le mot, et le texte s'écrit de droite à gauche. Le moteur de texte par défaut des logiciels Adobe est conçu pour l'alphabet latin : il ne lie pas les lettres et n'inverse pas le sens. La solution est d'activer le moteur des langues du Moyen-Orient et d'Asie du Sud.

## Dans Photoshop

1. Ouvrez **Édition → Préférences → Texte** (sur Mac : **Photoshop → Réglages → Texte**).
2. Dans **Options du moteur de texte**, choisissez **Moyen-Orient et Asie du Sud**.
3. Cliquez sur **OK**, puis **fermez et relancez Photoshop** : le changement ne s'applique qu'après redémarrage.
4. Créez un nouveau calque de texte et tapez le texte arabe. Les anciens calques peuvent devoir être retapés.
5. Dans le menu du panneau **Paragraphe**, choisissez le **compositeur ligne par ligne Moyen-Orient et Asie du Sud** et réglez le sens du paragraphe de droite à gauche.

## Dans Illustrator

1. Ouvrez **Édition → Préférences → Texte** et activez les options Moyen-Orient et Asie du Sud.
2. Dans le menu du panneau **Paragraphe**, choisissez le compositeur ligne par ligne Moyen-Orient et Asie du Sud.
3. Réglez le sens du paragraphe de droite à gauche.

## Dans After Effects

Ouvrez **Préférences → Texte**, choisissez le moteur **Asie du Sud et Moyen-Orient**, puis relancez le logiciel.

## Toujours un problème ?

- **La police ne contient pas l'arabe :** beaucoup de polices latines n'ont pas de lettres arabes, le logiciel les remplace par une autre police ou des carrés. Choisissez une police arabe dans la [bibliothèque](/fr) et vérifiez son aperçu.
- **Version très ancienne :** les anciennes versions demandaient une édition « ME ». Mettez le logiciel à jour.
- **Texte copié depuis un site :** des marques de direction invisibles peuvent suivre. Tapez le texte directement ou collez-le en texte brut.
- **Logiciel sans support de l'arabe :** écrivez le texte dans le [générateur de police arabe](/fr/generateur-police-arabe), téléchargez un PNG transparent et placez-le sur votre visuel.

## En résumé

Le plus souvent, il suffit de passer au moteur **Moyen-Orient et Asie du Sud** et de redémarrer. Si le problème persiste, vérifiez que la police prend en charge l'arabe.

## Références

- [Arabic and Hebrew type in Photoshop — Adobe](https://helpx.adobe.com/photoshop/using/arabic-hebrew-type.html)
- [Arabic and Hebrew type in Illustrator — Adobe](https://helpx.adobe.com/illustrator/using/arabic-hebrew-type.html)`,
    },
  },
  "kayfa-tuthabbit-khat-ala-windows-wal-mac": {
    en: {
      title: "How to Install an Arabic Font on Windows and Mac",
      excerpt: "How to install TTF and OTF font files on Windows 10, Windows 11 and Mac, make the font show up in Word and Photoshop, and fix common problems.",
      content: `After downloading an Arabic font you usually get a **TTF** or **OTF** file, sometimes inside a ZIP archive. These steps make the font available in all your apps.

## Before installing: unzip

If the file is a ZIP, right-click it and choose **Extract All** on Windows, or double-click it on Mac. A font cannot be installed from inside the archive.

## Install on Windows 10 and 11

1. Open the folder that contains the font file.
2. Right-click the file and choose **Install**. To install it for every user on the computer, choose **Install for all users**.
3. Reopen the app where you want to use the font.

Alternative: open **Settings → Personalization → Fonts** and drag the font file onto the drop area.

## Install on Mac

1. Double-click the font file to open it in **Font Book**.
2. Click **Install**.
3. Font Book may warn about problems in the file; review them before continuing.

## The font does not show up?

- **Restart the app:** Word, Photoshop and most apps read the font list only when they open.
- **Search by its English name:** the font may appear under its internal name, which can differ from the file name.
- **Word and Arabic text:** open the **Font** dialog (Ctrl+D) and pick the font under **Complex scripts**, because Word uses a separate font for Arabic.
- **Letters broken in Photoshop:** that is an app setting, not the font. See [Arabic letters broken in Photoshop](/en/blog/arabic-letters-broken-in-photoshop).
- **Damaged file:** if the system refuses to install it, download the file again.

## Uninstall a font

On Windows open **Settings → Personalization → Fonts**, choose the font and click **Uninstall**. On Mac open Font Book, select the font and press Delete.

## A note on licences

Installing a font does not give you the right to use it commercially. Check the licence on the font's page on xfontat before using it in a logo or a product for sale.

## References

- [Download and install custom fonts to use with Office — Microsoft](https://support.microsoft.com/en-us/office/download-and-install-custom-fonts-to-use-with-office-0ee09e74-edc1-480c-81c2-5cf9537c70ce)`,
    },
    fr: {
      title: "Installer une police arabe sur Windows et Mac pas à pas",
      excerpt: "Comment installer des polices TTF et OTF sur Windows 10, Windows 11 et Mac, les faire apparaître dans Word et Photoshop, et régler les problèmes courants.",
      content: `Après avoir téléchargé une police arabe, vous obtenez généralement un fichier **TTF** ou **OTF**, parfois dans une archive ZIP. Voici comment la rendre disponible dans tous vos logiciels.

## Avant l'installation : décompresser

Si le fichier est un ZIP, faites un clic droit puis **Extraire tout** sur Windows, ou double-cliquez dessus sur Mac. Une police ne s'installe pas depuis l'archive.

## Installer sur Windows 10 et 11

1. Ouvrez le dossier qui contient le fichier de police.
2. Faites un clic droit sur le fichier et choisissez **Installer**. Pour tous les utilisateurs de l'ordinateur, choisissez **Installer pour tous les utilisateurs**.
3. Rouvrez le logiciel dans lequel vous voulez utiliser la police.

Autre méthode : ouvrez **Paramètres → Personnalisation → Polices** et glissez le fichier dans la zone prévue.

## Installer sur Mac

1. Double-cliquez sur le fichier pour l'ouvrir dans **Livre des polices**.
2. Cliquez sur **Installer**.
3. Le Livre des polices peut signaler des problèmes dans le fichier ; vérifiez-les avant de continuer.

## La police n'apparaît pas ?

- **Relancez le logiciel :** Word, Photoshop et la plupart des logiciels lisent la liste des polices à l'ouverture.
- **Cherchez son nom anglais :** la police peut apparaître sous son nom interne, différent du nom du fichier.
- **Word et le texte arabe :** ouvrez la boîte **Police** (Ctrl+D) et choisissez la police dans **Script complexe**, car Word utilise une police distincte pour l'arabe.
- **Lettres séparées dans Photoshop :** c'est un réglage du logiciel. Voir [Lettres arabes séparées dans Photoshop](/fr/blog/lettres-arabes-separees-photoshop).
- **Fichier endommagé :** si le système refuse l'installation, téléchargez de nouveau le fichier.

## Désinstaller une police

Sur Windows, ouvrez **Paramètres → Personnalisation → Polices**, choisissez la police puis **Désinstaller**. Sur Mac, sélectionnez-la dans le Livre des polices et appuyez sur Supprimer.

## Rappel sur les licences

Installer une police ne donne pas le droit de l'utiliser commercialement. Vérifiez la licence sur la page de la police avant de l'utiliser dans un logo ou un produit vendu.

## Références

- [Download and install custom fonts to use with Office — Microsoft](https://support.microsoft.com/en-us/office/download-and-install-custom-fonts-to-use-with-office-0ee09e74-edc1-480c-81c2-5cf9537c70ce)`,
    },
  },
  "idafat-khat-arabi-ila-canva-wa-word": {
    en: {
      title: "How to Add an Arabic Font to Canva, Word and Google Docs",
      excerpt: "How to upload an Arabic font to Canva, use it in Microsoft Word, and the options in Google Docs, which does not accept font uploads.",
      content: `Each app handles fonts differently: some use the fonts installed on your computer, others run in the browser and need the font uploaded.

## Add a font to Canva

Canva lets you upload fonts on paid plans such as Canva Pro and Canva Teams, not on the free plan.

1. Open **Brand** or **Brand Kit** from the side menu.
2. Under **Brand fonts**, click **Upload a font**.
3. Choose an **OTF**, **TTF** or **WOFF** file.
4. Canva asks you to confirm that you hold a licence for the font; check this on the font's page before agreeing.
5. Once uploaded, the font appears in the font list of any design.

**Without a subscription:** Canva includes Arabic fonts such as Cairo, Tajawal and Amiri. You can also write your text in the [Arabic font generator](/en/arabic-font-generator), download a transparent PNG and upload it to Canva as an image.

## Use an Arabic font in Microsoft Word

Word on desktop uses the fonts installed on your computer.

1. Install the font first: see [how to install a font on Windows and Mac](/en/blog/install-arabic-font-windows-mac).
2. Close Word and open it again.
3. Select the Arabic text, open the **Font** dialog (Ctrl+D) and choose the font under **Complex scripts**, because Word applies that setting to Arabic letters.

**When sending the file:** if someone opens it on a computer without the font, they see a substitute. Send a PDF, or turn on **Embed fonts in the file** under **File → Options → Save**; some font licences do not allow embedding.

## Google Docs and Google Slides

Google Docs does not accept font uploads, but you can use Google Fonts' Arabic fonts:

1. Open the font menu and click **More fonts**.
2. Under **Scripts**, choose **Arabic** to list the fonts that support it.
3. Add fonts such as Cairo, Tajawal, Amiri or Noto Naskh Arabic.

If you need a font that is not in Google Fonts, write the heading in the [Arabic font generator](/en/arabic-font-generator) and insert it as an image.

## References

- [Upload fonts — Canva Help Center](https://www.canva.com/help/upload-fonts/)
- [Download and install custom fonts to use with Office — Microsoft](https://support.microsoft.com/en-us/office/download-and-install-custom-fonts-to-use-with-office-0ee09e74-edc1-480c-81c2-5cf9537c70ce)`,
    },
    fr: {
      title: "Ajouter une police arabe à Canva, Word et Google Docs",
      excerpt: "Comment importer une police arabe dans Canva, l'utiliser dans Microsoft Word, et les solutions dans Google Docs, qui n'accepte pas l'import de polices.",
      content: `Chaque logiciel gère les polices à sa manière : certains utilisent les polices installées sur votre ordinateur, d'autres fonctionnent dans le navigateur et demandent d'importer la police.

## Ajouter une police à Canva

Canva permet d'importer des polices avec les offres payantes comme Canva Pro et Canva Teams, pas avec l'offre gratuite.

1. Ouvrez **Marque** ou **Kit de marque** dans le menu latéral.
2. Dans **Polices de la marque**, cliquez sur **Importer une police**.
3. Choisissez un fichier **OTF**, **TTF** ou **WOFF**.
4. Canva vous demande de confirmer que vous détenez la licence ; vérifiez-le sur la page de la police avant d'accepter.
5. La police apparaît ensuite dans la liste de n'importe quel design.

**Sans abonnement :** Canva propose des polices arabes comme Cairo, Tajawal et Amiri. Vous pouvez aussi écrire votre texte dans le [générateur de police arabe](/fr/generateur-police-arabe), télécharger un PNG transparent et l'importer dans Canva comme image.

## Utiliser une police arabe dans Microsoft Word

Word sur ordinateur utilise les polices installées.

1. Installez d'abord la police : voir [installer une police sur Windows et Mac](/fr/blog/installer-police-arabe-windows-mac).
2. Fermez Word et rouvrez-le.
3. Sélectionnez le texte arabe, ouvrez la boîte **Police** (Ctrl+D) et choisissez la police dans **Script complexe**, car Word applique ce réglage aux lettres arabes.

**En envoyant le fichier :** sur un ordinateur sans la police, une police de remplacement s'affiche. Envoyez un PDF ou activez **Incorporer les polices dans le fichier** dans **Fichier → Options → Enregistrement** ; certaines licences interdisent l'incorporation.

## Google Docs et Google Slides

Google Docs n'accepte pas l'import de polices, mais propose les polices arabes de Google Fonts :

1. Ouvrez le menu des polices et cliquez sur **Autres polices**.
2. Dans **Scripts**, choisissez **Arabe** pour lister les polices compatibles.
3. Ajoutez par exemple Cairo, Tajawal, Amiri ou Noto Naskh Arabic.

Pour une police absente de Google Fonts, écrivez le titre dans le [générateur de police arabe](/fr/generateur-police-arabe) et insérez-le comme image.

## Références

- [Upload fonts — Canva Help Center](https://www.canva.com/help/upload-fonts/)
- [Download and install custom fonts to use with Office — Microsoft](https://support.microsoft.com/en-us/office/download-and-install-custom-fonts-to-use-with-office-0ee09e74-edc1-480c-81c2-5cf9537c70ce)`,
    },
  },
  "anwa-alkhotot-alarabiya": {
    en: {
      title: "Types of Arabic Calligraphy: 8 Styles with Their Uses",
      excerpt: "A short guide to the main Arabic calligraphy styles: Naskh, Thuluth, Ruqaa, Diwani, Kufi, Nastaliq, Maghribi and modern display fonts, how to tell them apart and when to use each.",
      content: `Arabic script has developed many styles over more than a thousand years, each with its own look and uses. Here are the eight best known, how to recognise them and where each one fits.

## 1. Naskh

The clearest Arabic style and the easiest to read, which is why books, newspapers and the Quran are printed in it. Its letters are balanced and evenly spaced.

- **Recognise it by:** clear letters of similar size and moderate curves.
- **Use it for:** long texts, books, websites and apps.

[Download Naskh fonts](/en/fonts/naskh)

## 2. Thuluth

Called the mother of Arabic scripts, Thuluth is the hardest to write and the most ornate. Its letters overlap in artistic compositions seen on mosques, wall art and book covers.

- **Recognise it by:** tall curved letters, words stacked on each other and many decorative marks.
- **Use it for:** luxury headings, wall art and Islamic logos.

[Download Thuluth fonts](/en/fonts/thuluth)

## 3. Ruqaa

The most common everyday handwriting. Its short, straight letters are quick to write; it took shape in the Ottoman era to speed up official writing.

- **Recognise it by:** short unadorned letters, joined dots and a slight slant.
- **Use it for:** short headings, ads, signs and quick notes.

[Download Ruqaa fonts](/en/fonts/ruqaa) · [Ruqaa font generator](/en/ruqaa-font-generator)

## 4. Diwani

The script of the Ottoman chancery, with flowing letters joined in continuous curves. Its ornate form is called Diwani Jali.

- **Recognise it by:** rounded, interlaced letters rising at the end of the line.
- **Use it for:** invitations, greeting cards, certificates and names.

[Download Diwani fonts](/en/fonts/diwani)

## 5. Kufi

The oldest Arabic style, named after the city of Kufa. Its geometric letters have sharp angles and straight lines, with many variants such as square Kufi and floriated Kufi.

- **Recognise it by:** right angles and clear horizontal and vertical strokes.
- **Use it for:** logos, brand identities, architectural decoration and modern design.

[Download Kufi fonts](/en/fonts/kufi)

## 6. Nastaliq (Farsi)

Born in Persia from Naskh and Ta'liq, it is often called Farsi script in the Arab world. Its words slope from top right to bottom left with fine, elegant letters.

- **Recognise it by:** slanted, cascading words and long thin strokes.
- **Use it for:** poetry, short phrases, and Persian and Urdu text.

[Download Nastaliq fonts](/en/fonts/nastaliq)

## 7. Maghribi

The script of North Africa and Andalusia, used for Qurans in the Maghreb. It dots fa and qaf differently from the East: fa with a dot below, qaf with a single dot above.

- **Recognise it by:** wide rounded letters and long curved endings.
- **Use it for:** heritage texts and designs with a North African feel.

## 8. Modern display fonts

Contemporary digital fonts made for screens and advertising, some based on Kufi or Naskh and others entirely new, from bold headline fonts to handwritten styles.

- **Recognise them by:** simplified shapes and several weights from thin to bold.
- **Use them for:** social media, ads, websites and video.

[Download display fonts](/en/fonts/tasmeem)

## Quick comparison

| Style | Look | Main use |
|---|---|---|
| Naskh | Clear and balanced | Books and long texts |
| Thuluth | Ornate and stacked | Wall art and luxury headings |
| Ruqaa | Short and quick | Everyday writing and headings |
| Diwani | Rounded and interlaced | Invitations and greetings |
| Kufi | Geometric and angular | Logos and identities |
| Nastaliq | Slanted and elegant | Poetry and phrases |
| Maghribi | Wide and rounded | Heritage texts |
| Display | Simple and modern | Ads and social media |

## How to choose

- **For long reading:** Naskh or a simple display font.
- **For an artistic heading or a name:** Thuluth or Diwani.
- **For a logo:** Kufi or a bold display font.
- **For a quick post:** Ruqaa or a display font.

Try your text in every style in the [font library](/en), or write a name in any font and download it with the [Arabic font generator](/en/arabic-font-generator).`,
    },
    fr: {
      title: "Les types de calligraphie arabe : 8 styles et leurs usages",
      excerpt: "Guide des principaux styles de calligraphie arabe : naskh, thuluth, ruqaa, diwani, coufique, nastaliq, maghribi et polices modernes, comment les reconnaître et quand les utiliser.",
      content: `L'écriture arabe a développé de nombreux styles en plus de mille ans, chacun avec son allure et ses usages. Voici les huit plus connus, comment les reconnaître et à quoi ils servent.

## 1. Le naskh

Le style le plus clair et le plus lisible, d'où son usage dans les livres, les journaux et le Coran imprimé. Ses lettres sont équilibrées et régulièrement espacées.

- **Signes distinctifs :** lettres claires de taille proche, courbes modérées.
- **Usages :** textes longs, livres, sites et applications.

[Télécharger des polices naskh](/fr/fonts/naskh)

## 2. Le thuluth

Surnommé la mère des écritures arabes, c'est le plus difficile à écrire et le plus orné. Ses lettres se superposent dans des compositions qu'on voit sur les mosquées, les tableaux et les couvertures de livres.

- **Signes distinctifs :** lettres hautes et courbes, mots superposés, nombreux signes décoratifs.
- **Usages :** titres prestigieux, tableaux, logos islamiques.

[Télécharger des polices thuluth](/fr/fonts/thuluth)

## 3. Le ruqaa

L'écriture manuscrite la plus courante. Ses lettres courtes et droites s'écrivent vite ; il s'est formé à l'époque ottomane pour accélérer l'écriture officielle.

- **Signes distinctifs :** lettres courtes sans ornement, points liés, légère inclinaison.
- **Usages :** titres courts, publicités, enseignes, notes rapides.

[Télécharger des polices ruqaa](/fr/fonts/ruqaa) · [Générateur d'écriture ruqaa](/fr/generateur-ecriture-ruqaa)

## 4. Le diwani

L'écriture de la chancellerie ottomane, aux lettres fluides liées en courbes continues. Sa forme ornée s'appelle diwani jali.

- **Signes distinctifs :** lettres arrondies et entrelacées qui montent en fin de ligne.
- **Usages :** invitations, cartes de vœux, diplômes, prénoms.

[Télécharger des polices diwani](/fr/fonts/diwani)

## 5. Le coufique

Le plus ancien style arabe, du nom de la ville de Koufa. Ses lettres géométriques ont des angles vifs et des traits droits, avec de nombreuses variantes comme le coufique carré ou fleuri.

- **Signes distinctifs :** angles droits, traits horizontaux et verticaux nets.
- **Usages :** logos, identités visuelles, décoration architecturale, design moderne.

[Télécharger des polices coufiques](/fr/fonts/kufi)

## 6. Le nastaliq (farsi)

Né en Perse du naskh et du ta'liq, il est souvent appelé écriture farsi dans le monde arabe. Ses mots descendent du haut à droite vers le bas à gauche, avec des lettres fines et élégantes.

- **Signes distinctifs :** mots inclinés en cascade, traits longs et fins.
- **Usages :** poésie, phrases courtes, persan et ourdou.

[Télécharger des polices nastaliq](/fr/fonts/nastaliq)

## 7. Le maghribi

L'écriture du Maghreb et d'al-Andalus, utilisée pour les corans d'Afrique du Nord. Il ponctue le fa et le qaf autrement qu'en Orient : le fa avec un point dessous, le qaf avec un seul point dessus.

- **Signes distinctifs :** lettres larges et arrondies, longues terminaisons courbes.
- **Usages :** textes patrimoniaux, visuels d'inspiration maghrébine.

## 8. Les polices modernes

Des polices numériques contemporaines pour les écrans et la publicité, certaines inspirées du coufique ou du naskh, d'autres entièrement nouvelles.

- **Signes distinctifs :** formes simplifiées, plusieurs graisses du fin au gras.
- **Usages :** réseaux sociaux, publicités, sites, vidéo.

[Télécharger des polices décoratives](/fr/fonts/tasmeem)

## Comparaison rapide

| Style | Allure | Usage principal |
|---|---|---|
| Naskh | Clair et équilibré | Livres et textes longs |
| Thuluth | Orné et superposé | Tableaux et titres prestigieux |
| Ruqaa | Court et rapide | Écriture courante et titres |
| Diwani | Arrondi et entrelacé | Invitations et vœux |
| Coufique | Géométrique et anguleux | Logos et identités |
| Nastaliq | Incliné et élégant | Poésie et phrases |
| Maghribi | Large et arrondi | Textes patrimoniaux |
| Moderne | Simple et actuel | Publicité et réseaux sociaux |

## Comment choisir

- **Pour une lecture longue :** naskh ou police moderne simple.
- **Pour un titre artistique ou un prénom :** thuluth ou diwani.
- **Pour un logo :** coufique ou police moderne grasse.
- **Pour une publication rapide :** ruqaa ou police moderne.

Testez votre texte dans chaque style dans la [bibliothèque](/fr), ou écrivez un prénom dans n'importe quelle police avec le [générateur de police arabe](/fr/generateur-police-arabe).`,
    },
  },
  "khotot-alarqam-alarabiya": {
    en: {
      title: "Arabic Numerals in Fonts: ١٢٣ vs 123 and the Best Fonts",
      excerpt: "The difference between Eastern Arabic numerals (١٢٣) and Western Arabic numerals (123), how to pick a font with good digits, and how to switch between them in Word and Photoshop.",
      content: `Arabic text uses two sets of digits, and each has its place.

## Two sets of digits

| Type | Shape | Where it is used |
|---|---|---|
| Eastern Arabic numerals | ٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ | Egypt, the Gulf, Iraq and the Levant |
| Western Arabic numerals | 0 1 2 3 4 5 6 7 8 9 | The Maghreb and most of the world |

The digits the world calls "Arabic numerals" are 0123456789; they reached Europe from the Arab world through Andalusia. The digits ١٢٣ are called Arabic numerals in the Middle East and Eastern Arabic numerals in Western sources.

## Does every Arabic font include digits?

Most modern Arabic fonts include both sets, but their design varies a lot. Some calligraphic fonts such as Thuluth and Diwani have no digits at all, so the app falls back to another font.

**Before choosing a font for numbers:** type something like "٢٠٢٧ - 2027" in the preview box of the [font library](/en) to compare both sets in every font.

## Fonts with clear, attractive digits

- **[Cairo](/en/font/cairo-regular):** modern, clear digits for designs and infographics.
- **[Tajawal](/en/font/tajawal-regular):** clean digits in many weights for websites and apps.
- **[Almarai](/en/font/almarai):** simple digits that read well on screens.
- **[Noto Kufi Arabic](/en/font/noto-kufi-arabic):** geometric digits for tables and headings.
- **[IBM Plex Sans Arabic](/en/font/ibm-plex-sans-arabic):** even-width digits for tables and prices.

## Switch between ١٢٣ and 123 in Word

1. Open **File → Options → Advanced**.
2. Under **Show document content**, find **Numeral**.
3. Choose **Hindi** for ١٢٣, **Arabic** for 123, or **Context** to follow the surrounding text.

## Switch in Photoshop

Turn on the Middle Eastern text engine first, as described in [Arabic letters broken in Photoshop](/en/blog/arabic-letters-broken-in-photoshop), then pick the digit type in the **Character** panel under **Digits**: Arabic, Hindi or Farsi.

## On a phone

Type digits from the Arabic keyboard to get ١٢٣, or from the English one to get 123. To type Arabic on a device without an Arabic keyboard, use the [online Arabic keyboard](/en/arabic-keyboard).

## A design tip

Do not mix both sets in one design, and use the set your audience expects: ١٢٣ for the Gulf, Egypt and the Levant, 123 for the Maghreb and for prices and technical figures.`,
    },
    fr: {
      title: "Chiffres arabes et polices : ١٢٣ ou 123 et les meilleures polices",
      excerpt: "La différence entre chiffres arabes orientaux (١٢٣) et chiffres arabes occidentaux (123), comment choisir une police aux beaux chiffres et comment passer de l'un à l'autre dans Word et Photoshop.",
      content: `Le texte arabe utilise deux séries de chiffres, chacune avec ses usages.

## Deux séries de chiffres

| Type | Forme | Où ils sont utilisés |
|---|---|---|
| Chiffres arabes orientaux | ٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ | Égypte, Golfe, Irak et Levant |
| Chiffres arabes occidentaux | 0 1 2 3 4 5 6 7 8 9 | Maghreb et la plupart des pays |

Les chiffres que le monde appelle « chiffres arabes » sont 0123456789 ; ils sont arrivés en Europe depuis le monde arabe par al-Andalus. Les chiffres ١٢٣ s'appellent chiffres arabes au Moyen-Orient et chiffres arabes orientaux dans les sources occidentales.

## Toutes les polices arabes ont-elles des chiffres ?

La plupart des polices arabes modernes contiennent les deux séries, mais leur dessin varie beaucoup. Certaines polices calligraphiques comme le thuluth ou le diwani n'en ont pas du tout ; le logiciel utilise alors une autre police.

**Avant de choisir une police pour des chiffres :** tapez par exemple « ٢٠٢٧ - 2027 » dans l'aperçu de la [bibliothèque](/fr) pour comparer les deux séries dans chaque police.

## Des polices aux chiffres clairs et élégants

- **[Cairo](/fr/font/cairo-regular) :** chiffres modernes et nets pour les visuels et infographies.
- **[Tajawal](/fr/font/tajawal-regular) :** chiffres propres en plusieurs graisses pour les sites et applis.
- **[Almarai](/fr/font/almarai) :** chiffres simples, très lisibles à l'écran.
- **[Noto Kufi Arabic](/fr/font/noto-kufi-arabic) :** chiffres géométriques pour tableaux et titres.
- **[IBM Plex Sans Arabic](/fr/font/ibm-plex-sans-arabic) :** chiffres à chasse égale pour tableaux et prix.

## Passer de ١٢٣ à 123 dans Word

1. Ouvrez **Fichier → Options → Options avancées**.
2. Dans **Afficher le contenu du document**, repérez **Chiffres**.
3. Choisissez **Hindi** pour ١٢٣, **Arabe** pour 123, ou **Contexte** pour suivre le texte environnant.

## Dans Photoshop

Activez d'abord le moteur de texte moyen-oriental, comme expliqué dans [Lettres arabes séparées dans Photoshop](/fr/blog/lettres-arabes-separees-photoshop), puis choisissez le type de chiffres dans le panneau **Caractère**, rubrique **Chiffres** : arabes, hindis ou farsis.

## Sur téléphone

Tapez les chiffres depuis le clavier arabe pour obtenir ١٢٣, ou depuis le clavier français pour 123. Pour écrire en arabe sans clavier arabe, utilisez le [clavier arabe en ligne](/fr/clavier-arabe).

## Un conseil de design

Ne mélangez pas les deux séries dans un même visuel, et utilisez celle qu'attend votre public : ١٢٣ pour le Golfe, l'Égypte et le Levant, 123 pour le Maghreb, les prix et les chiffres techniques.`,
    },
  },
};
