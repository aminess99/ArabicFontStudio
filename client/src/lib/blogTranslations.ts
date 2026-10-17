import type { SiteLocale } from "./localizedPagesContent";
import generatedTranslations from "./blogPostTranslations.json";


export const localizedBlogPosts: Record<SiteLocale, Record<string, { title: string; excerpt: string; summary: string }>> = {
  en: {
    "daleel-ikhtiyar-alkhat-alarabi": {
      title: "A practical guide to choosing an Arabic font",
      excerpt: "A checklist for comparing Arabic typefaces against the text, format, and license needs of a project.",
      summary: "Start with the words and medium the project actually requires. Compare legibility, character coverage, shaping, file format, and license using a realistic sample before choosing a font.",
    },
    "alfarq-bayn-thuluth-kufi-ruqaa": {
      title: "Comparing Thuluth, Kufi, and Ruqah",
      excerpt: "Compare the visible characteristics of three Arabic font categories and test them with your own text.",
      summary: "These categories contain varied digital designs, so category names alone do not guarantee a particular appearance. Preview the same text in each file and compare readability and layout fit.",
    },
    "best-practices-arabic-fonts-digital-design": {
      title: "Arabic fonts in digital design: practical checks",
      excerpt: "Review Arabic shaping, direction, character coverage, and rendering in the target browser or application.",
      summary: "Test Arabic text in the actual software and browser where it will appear. Check direction, connected letters, diacritics, fallback behavior, and the license for the selected file.",
    },
    "how-to-download-use-arabic-fonts": {
      title: "How to download and use Arabic fonts from xfontat",
      excerpt: "Find a font file, inspect its format and source, then test it in your intended application.",
      summary: "Choose a category or search by name, review the file details and license, then download and install the file using your operating system’s instructions. Test Arabic text in the target application.",
    },
    "ethical-use-arabic-fonts": {
      title: "Responsible use of Arabic fonts",
      excerpt: "Why checking the original license and respecting the type designer matters.",
      summary: "A font’s download availability is not the same as permission for every use. Read the original license, follow its restrictions, and credit or contact the creator where the terms require it.",
    },
    "afdal-10-khotot-arabiya-lil-tasmeem": {
      title: "10 Arabic font files in the xfontat library to compare for design",
      excerpt: "Compare available font files with your project and check each file’s format, source, and license.",
      summary: "There is no single font that fits every design. Compare candidate files with the project’s actual wording, size, medium, and language requirements, then review their licenses.",
    },
    "khotot-arabiya-lil-photoshop-majanan": {
      title: "Arabic fonts in Photoshop: compatibility and installation",
      excerpt: "Test Arabic shaping, direction, file format, and compatibility with your Photoshop version.",
      summary: "Compatibility depends on the font file, operating system, and Photoshop version. Install a supported format, test connected Arabic text and direction, and verify the file’s license.",
    },
    "khotot-arabiya-lil-shiaarat-wal-logos": {
      title: "Choosing Arabic fonts for logos",
      excerpt: "Compare a brand name at several sizes and check legibility, distinctiveness, and usage rights.",
      summary: "Test the exact brand name in multiple candidate files and at small and large sizes. Review the license before using a font in a commercial identity.",
    },
    "khotot-arabiya-muzakhrafa-lil-tasmeem": {
      title: "Decorative Arabic fonts for visual design",
      excerpt: "Test decorative forms with real wording and make sure ornament does not obscure important information.",
      summary: "Decorative styles can suit short headings and compositions, but legibility depends on the individual design and size. Preview names and key details in the final layout.",
    },
    "khotot-arabiya-lil-social-media": {
      title: "Arabic fonts for social media graphics",
      excerpt: "Preview text at the intended screen size and check contrast, clarity, and file rights.",
      summary: "View the graphic at its actual mobile display size. Check that Arabic letters remain readable against the background and confirm the font license before publishing.",
    },
    "khotot-arabiya-lil-youtubiyeen": {
      title: "Arabic font choices for video titles and thumbnails",
      excerpt: "Check title readability at small sizes and compare the font within the actual image composition.",
      summary: "Preview the exact title inside the thumbnail, then inspect it at the small size viewers will see. A font choice alone does not guarantee more views or clicks.",
    },
    "khotot-arabiya-lil-kotob-wal-matbooaat": {
      title: "Selecting Arabic fonts for books and print",
      excerpt: "Test a representative passage, page size, diacritics, and output workflow before committing to a font.",
      summary: "Compare candidate files using real text and the intended page size. Check character and diacritic coverage, print output, and the license before publication.",
    },
    "khotot-arabiya-lil-dawaat-wal-munasabaat": {
      title: "Arabic fonts for invitations and event materials",
      excerpt: "Test names, dates, and key details in the actual invitation layout.",
      summary: "Preview the names, dates, and venue information at their final sizes. Decorative forms should not make essential details difficult to read; check print requirements and license terms.",
    },
    "khotot-arabiya-lil-alamat-al-tijariya": {
      title: "Choosing Arabic fonts for brand identity",
      excerpt: "Evaluate how a font renders a brand name and check its license for the intended use.",
      summary: "Test the brand name in the intended identity applications, including small formats. Confirm the font’s license covers the planned commercial use.",
    },
    "khotot-arabiya-lil-wosham": {
      title: "Arabic lettering for tattoo design: checks before use",
      excerpt: "Verify the exact text, letter connections, and source before using Arabic lettering in a permanent design.",
      summary: "Arabic lettering can change with context and connections. Verify the wording with a knowledgeable reader, inspect the exact rendered forms, and confirm permission for the font file.",
    },
    "khotot-arabiya-lil-mawaqi-wal-tatbeeqat": {
      title: "Choosing an Arabic font for websites and apps",
      excerpt: "Test shaping, language coverage, loading, and fallback behavior on the target platforms.",
      summary: "Use a representative Arabic sample to test shaping, diacritics, loading, and fallback behavior in the browsers and devices you support. Check the font’s web-use license before embedding it.",
    },
  },
  fr: {
    "daleel-ikhtiyar-alkhat-alarabi": {
      title: "Guide pratique pour choisir une police arabe",
      excerpt: "Une liste de vérification pour comparer les polices arabes selon le texte, le format et la licence du projet.",
      summary: "Partez du texte et du support réellement prévus. Comparez la lisibilité, les caractères couverts, le façonnage, le format et la licence avec un exemple représentatif.",
    },
    "alfarq-bayn-thuluth-kufi-ruqaa": {
      title: "Comparer les styles Thuluth, Kufi et Ruqah",
      excerpt: "Comparez trois catégories de polices arabes et testez-les avec votre propre texte.",
      summary: "Ces catégories regroupent des dessins numériques variés ; leur nom ne garantit pas une apparence précise. Prévisualisez le même texte dans chaque fichier et comparez lisibilité et mise en page.",
    },
    "best-practices-arabic-fonts-digital-design": {
      title: "Polices arabes en design numérique : vérifications pratiques",
      excerpt: "Vérifiez le façonnage arabe, le sens d’écriture et le rendu dans le navigateur ou logiciel visé.",
      summary: "Testez le texte arabe dans le logiciel et le navigateur prévus. Vérifiez le sens d’écriture, les lettres liées, les signes diacritiques, les polices de remplacement et la licence du fichier.",
    },
    "how-to-download-use-arabic-fonts": {
      title: "Télécharger et utiliser des polices arabes depuis xfontat",
      excerpt: "Choisissez un fichier, consultez son format et sa source, puis testez-le dans votre application.",
      summary: "Choisissez une catégorie ou recherchez un nom, consultez les détails et la licence, puis téléchargez et installez le fichier selon les instructions de votre système. Testez le texte arabe dans l’application visée.",
    },
    "ethical-use-arabic-fonts": {
      title: "Utiliser les polices arabes de façon responsable",
      excerpt: "L’importance de consulter la licence originale et de respecter le travail du créateur.",
      summary: "La disponibilité au téléchargement n’autorise pas tous les usages. Lisez la licence originale, respectez ses conditions et créditez ou contactez le créateur si elles le demandent.",
    },
    "afdal-10-khotot-arabiya-lil-tasmeem": {
      title: "10 fichiers de polices arabes à comparer dans xfontat",
      excerpt: "Comparez les fichiers disponibles à votre projet et vérifiez leur format, leur source et leur licence.",
      summary: "Aucune police ne convient à tous les projets. Comparez les fichiers avec le texte, la taille, le support et les besoins linguistiques réels, puis vérifiez leur licence.",
    },
    "khotot-arabiya-lil-photoshop-majanan": {
      title: "Polices arabes dans Photoshop : compatibilité et installation",
      excerpt: "Testez le façonnage arabe, le sens d’écriture, le format et la compatibilité avec votre version de Photoshop.",
      summary: "La compatibilité dépend du fichier, du système et de la version de Photoshop. Installez un format pris en charge, testez les lettres arabes liées et le sens du texte, puis vérifiez la licence.",
    },
    "khotot-arabiya-lil-shiaarat-wal-logos": {
      title: "Choisir une police arabe pour un logo",
      excerpt: "Testez le nom de marque à plusieurs tailles et vérifiez la lisibilité et les droits d’utilisation.",
      summary: "Testez le nom exact de la marque dans plusieurs fichiers et à différentes tailles. Consultez la licence avant tout usage dans une identité commerciale.",
    },
    "khotot-arabiya-muzakhrafa-lil-tasmeem": {
      title: "Polices arabes décoratives pour la création visuelle",
      excerpt: "Testez les formes décoratives avec le texte réel sans masquer les informations importantes.",
      summary: "Les styles décoratifs peuvent convenir aux titres courts, mais la lisibilité dépend du dessin et de la taille. Prévisualisez les noms et informations essentielles dans la mise en page finale.",
    },
    "khotot-arabiya-lil-social-media": {
      title: "Polices arabes pour les visuels des réseaux sociaux",
      excerpt: "Prévisualisez le texte à sa taille d’écran prévue et vérifiez contraste, clarté et droits.",
      summary: "Examinez le visuel à sa taille réelle sur mobile. Vérifiez que les lettres arabes restent lisibles sur le fond et confirmez la licence avant publication.",
    },
    "khotot-arabiya-lil-youtubiyeen": {
      title: "Polices arabes pour titres vidéo et miniatures",
      excerpt: "Vérifiez la lisibilité du titre en petit format et dans la composition réelle.",
      summary: "Prévisualisez le titre exact dans la miniature, puis vérifiez-le à la petite taille d’affichage. Le choix d’une police ne garantit pas plus de vues ou de clics.",
    },
    "khotot-arabiya-lil-kotob-wal-matbooaat": {
      title: "Choisir des polices arabes pour les livres et l’impression",
      excerpt: "Testez un extrait, le format de page, les signes diacritiques et la chaîne d’impression.",
      summary: "Comparez les fichiers avec un texte réel et le format de page prévu. Vérifiez les caractères, les signes diacritiques, le rendu imprimé et la licence avant publication.",
    },
    "khotot-arabiya-lil-dawaat-wal-munasabaat": {
      title: "Polices arabes pour invitations et événements",
      excerpt: "Testez les noms, dates et informations essentielles dans la mise en page réelle.",
      summary: "Prévisualisez noms, dates et lieu aux tailles finales. Les formes décoratives ne doivent pas rendre les informations difficiles à lire ; vérifiez les exigences d’impression et la licence.",
    },
    "khotot-arabiya-lil-alamat-al-tijariya": {
      title: "Choisir une police arabe pour une identité de marque",
      excerpt: "Évaluez le rendu du nom de marque et vérifiez la licence pour l’usage prévu.",
      summary: "Testez le nom de marque dans les applications prévues, y compris aux petits formats. Vérifiez que la licence couvre l’usage commercial envisagé.",
    },
    "khotot-arabiya-lil-wosham": {
      title: "Lettrage arabe pour tatouage : vérifications avant usage",
      excerpt: "Vérifiez le texte exact, les liaisons des lettres et la source avant un dessin permanent.",
      summary: "Les formes arabes varient selon le contexte et les liaisons. Faites vérifier le texte par une personne compétente, examinez le rendu exact et confirmez les droits du fichier.",
    },
    "khotot-arabiya-lil-mawaqi-wal-tatbeeqat": {
      title: "Choisir une police arabe pour un site web ou une application",
      excerpt: "Testez le façonnage, les caractères, le chargement et les polices de remplacement.",
      summary: "Testez un exemple représentatif pour vérifier le façonnage, les signes diacritiques, le chargement et les polices de remplacement sur les navigateurs et appareils visés. Vérifiez la licence d’intégration web.",
    },
  },
};

export interface FullBlogTranslation {
  title: string;
  excerpt: string;
  content: string;
}

export const fullBlogTranslations = generatedTranslations as Record<
  string,
  Record<SiteLocale, FullBlogTranslation>
>;
