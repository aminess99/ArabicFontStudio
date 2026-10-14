export type SiteLocale = "en" | "fr";

export interface LocalizedCollection {
  title: string;
  description: string;
  useCases: string[];
}

export const localizedCollections: Record<SiteLocale, Record<string, LocalizedCollection>> = {
  en: {
    "khotot-lil-shiaarat": {
      title: "Arabic fonts for logos",
      description: "Preview Arabic font files for brand names and visual identities. Check the format and license of each file before use.",
      useCases: ["Logos", "Brand identities", "Business cards"],
    },
    "khotot-lil-tiktok": {
      title: "Arabic fonts for social media",
      description: "Browse Arabic font files for short-form video and social graphics. Preview the text at its intended size.",
      useCases: ["Short videos", "Social posts", "Stories"],
    },
    "khotot-muzakhrafa": {
      title: "Decorative Arabic fonts",
      description: "Compare decorative Arabic font files for headings and visual compositions. Test readability in the final layout.",
      useCases: ["Invitations", "Certificates", "Decorative headings"],
    },
    "khotot-lil-kotob": {
      title: "Arabic fonts for books and print",
      description: "Browse Arabic font files for books and printed material. Test a sample passage and check diacritic support.",
      useCases: ["Books", "Magazines", "Reports"],
    },
    "khotot-lil-photoshop": {
      title: "Arabic fonts for design software",
      description: "Explore Arabic font files grouped for design workflows. Check each format and test compatibility in your software version.",
      useCases: ["Image editing", "Design layouts", "Posters"],
    },
    "khotot-lil-youtubiyeen": {
      title: "Arabic fonts for video creators",
      description: "Preview Arabic font files for video titles and thumbnails. Check readability at the size viewers will see.",
      useCases: ["Video titles", "Thumbnails", "Channel graphics"],
    },
    "khotot-lil-dawaat": {
      title: "Arabic fonts for invitations",
      description: "Browse Arabic font files for invitations and event graphics. Test names and dates in the final layout.",
      useCases: ["Wedding invitations", "Event cards", "Greetings"],
    },
    "khotot-bidoon-hoqooq": {
      title: "Arabic font files available to download",
      description: "Browse downloadable Arabic font files. Download availability does not determine usage rights; review each file’s license.",
      useCases: ["Personal projects", "Print", "Web and apps"],
    },
  },
  fr: {
    "khotot-lil-shiaarat": {
      title: "Polices arabes pour logos",
      description: "Prévisualisez des fichiers de polices arabes pour les noms de marque et les identités visuelles. Vérifiez le format et la licence de chaque fichier.",
      useCases: ["Logos", "Identités visuelles", "Cartes de visite"],
    },
    "khotot-lil-tiktok": {
      title: "Polices arabes pour les réseaux sociaux",
      description: "Parcourez des fichiers de polices arabes pour les vidéos courtes et les visuels sociaux. Prévisualisez le texte à sa taille prévue.",
      useCases: ["Vidéos courtes", "Publications", "Stories"],
    },
    "khotot-muzakhrafa": {
      title: "Polices arabes décoratives",
      description: "Comparez des fichiers de polices arabes décoratives pour les titres et compositions visuelles. Testez la lisibilité dans la mise en page finale.",
      useCases: ["Invitations", "Certificats", "Titres décoratifs"],
    },
    "khotot-lil-kotob": {
      title: "Polices arabes pour livres et imprimés",
      description: "Parcourez des fichiers de polices arabes pour les livres et imprimés. Testez un extrait et vérifiez la prise en charge des signes diacritiques.",
      useCases: ["Livres", "Revues", "Rapports"],
    },
    "khotot-lil-photoshop": {
      title: "Polices arabes pour logiciels de design",
      description: "Explorez des fichiers de polices arabes regroupés pour le design. Vérifiez le format et testez la compatibilité avec votre version logicielle.",
      useCases: ["Retouche d’image", "Mises en page", "Affiches"],
    },
    "khotot-lil-youtubiyeen": {
      title: "Polices arabes pour créateurs vidéo",
      description: "Prévisualisez des fichiers de polices arabes pour les titres vidéo et miniatures. Vérifiez la lisibilité à la taille d’affichage prévue.",
      useCases: ["Titres vidéo", "Miniatures", "Visuels de chaîne"],
    },
    "khotot-lil-dawaat": {
      title: "Polices arabes pour invitations",
      description: "Parcourez des fichiers de polices arabes pour les invitations et visuels d’événements. Testez les noms et dates dans la mise en page finale.",
      useCases: ["Invitations de mariage", "Cartes d’événement", "Messages de vœux"],
    },
    "khotot-bidoon-hoqooq": {
      title: "Fichiers de polices arabes à télécharger",
      description: "Parcourez des fichiers de polices arabes téléchargeables. La disponibilité au téléchargement ne définit pas les droits d’usage : vérifiez chaque licence.",
      useCases: ["Projets personnels", "Impression", "Web et applications"],
    },
  },
};

export const localizedStaticPages: Record<SiteLocale, {
  about: { title: string; description: string; sections: { heading: string; paragraphs: string[] }[] };
  contact: { title: string; description: string; heading: string; intro: string; form: string[] };
  privacy: { title: string; description: string; sections: { heading: string; body: string[] }[] };
  terms: { title: string; description: string; sections: { heading: string; body: string[] }[] };
}> = {
  en: {
    about: {
      title: "About xfontat",
      description: "Learn about xfontat, a directory for browsing and previewing Arabic font files and checking available file details.",
      sections: [
        { heading: "Welcome to xfontat", paragraphs: ["xfontat is a directory for browsing and previewing Arabic fonts. File formats and usage terms vary, so review the details and license for each file.", "Our aim is to make it easier to explore Arabic typefaces and preview them with different text before downloading."] },
        { heading: "Our mission", paragraphs: ["We organize the listed font files and provide previews that help designers, developers, and writers test text before downloading.", "We aim to improve the available font information and make source, format, and license details easier to find when available."] },
        { heading: "Using the directory", paragraphs: ["The category pages describe the digital files listed in the directory; they are not a substitute for specialist historical references.", "When historical information or attribution is added, it should include a source readers can verify."] },
      ],
    },
    contact: {
      title: "Contact xfontat",
      description: "Contact xfontat about the Arabic font directory, file information, or website issues.",
      heading: "Get in touch",
      intro: "Choose the address that best matches your question. For font usage rights, include the font name and its source page.",
      form: ["Name", "Email address", "Subject", "Message"],
    },
    privacy: {
      title: "Privacy policy",
      description: "Read how xfontat handles information when you use the website.",
      sections: [
        { heading: "Introduction", body: ["This policy describes information that may be collected and how it may be used when you visit xfontat."] },
        { heading: "Information and usage", body: ["Technical and usage information may include browser details, pages visited, and interactions with font files.", "We may use collected information to maintain and improve the website and understand how its features are used."] },
        { heading: "Cookies", body: ["The site or its service providers may use cookies or similar technologies for functionality and analytics. You can manage cookies in your browser settings; disabling them may affect some features."] },
        { heading: "Data security and sharing", body: ["Reasonable safeguards are used to protect information, but no online transmission or electronic storage method can be guaranteed completely secure.", "We do not sell personal information. Aggregated information may be used for analytics or shared where required to operate the service."] },
        { heading: "Your choices and policy changes", body: ["You may contact us about a privacy request or question. We may update this policy and will publish the revised text on this page."] },
        { heading: "Contact", body: ["For privacy questions, contact privacy@arabic-fonts.com."] },
      ],
    },
    terms: {
      title: "Terms of use",
      description: "Review the terms for using xfontat and the separate license conditions that apply to font files.",
      sections: [
        { heading: "Acceptance", body: ["By using xfontat, you agree to these website terms. If you do not agree, do not use the website."] },
        { heading: "Font files and licenses", body: ["Downloading a file does not grant rights beyond the license that applies to that file. Check the original license before commercial use, embedding, modification, or redistribution.", "Do not resell or redistribute font files as standalone files unless the applicable license permits it. Respect the rights of the original creators."] },
        { heading: "Intellectual property", body: ["Font files remain subject to the rights and licenses of their respective owners. xfontat does not replace or override those terms."] },
        { heading: "Prohibited use", body: ["Do not use the website unlawfully, attempt unauthorized access, submit harmful content, scrape the website without permission, or infringe another party’s rights."] },
        { heading: "Disclaimer and liability", body: ["The website and files are provided as available, without a guarantee of uninterrupted service or error-free files. Use them at your own discretion and verify file details before use.", "To the extent permitted by law, xfontat is not liable for indirect or consequential loss arising from use of the website or files."] },
        { heading: "Changes and contact", body: ["These terms may be updated by publishing a revised version on this page. For questions, contact legal@arabic-fonts.com."] },
      ],
    },
  },
  fr: {
    about: {
      title: "À propos de xfontat",
      description: "Découvrez xfontat, un répertoire pour parcourir et prévisualiser des fichiers de polices arabes.",
      sections: [
        { heading: "Bienvenue sur xfontat", paragraphs: ["xfontat est un répertoire permettant de parcourir et de prévisualiser des polices arabes. Les formats et conditions d’utilisation varient : consultez les détails et la licence de chaque fichier.", "Notre objectif est de faciliter l’exploration des polices arabes et leur prévisualisation avec différents textes avant téléchargement."] },
        { heading: "Notre mission", paragraphs: ["Nous organisons les fichiers présentés et proposons des aperçus pour aider les designers, développeurs et rédacteurs à tester leur texte avant le téléchargement.", "Nous souhaitons améliorer les informations disponibles et faciliter l’accès aux sources, formats et licences lorsqu’ils sont connus."] },
        { heading: "Utiliser le répertoire", paragraphs: ["Les pages de catégories décrivent les fichiers numériques répertoriés ; elles ne remplacent pas des références historiques spécialisées.", "Toute information historique ou attribution ajoutée devrait citer une source vérifiable par les lecteurs."] },
      ],
    },
    contact: {
      title: "Contacter xfontat",
      description: "Contactez xfontat au sujet du répertoire de polices arabes, des informations sur les fichiers ou d’un problème du site.",
      heading: "Nous contacter",
      intro: "Choisissez l’adresse correspondant à votre demande. Pour une question de droits d’utilisation, indiquez le nom de la police et sa page source.",
      form: ["Nom", "Adresse e-mail", "Objet", "Message"],
    },
    privacy: {
      title: "Politique de confidentialité",
      description: "Découvrez comment xfontat traite les informations lors de l’utilisation du site.",
      sections: [
        { heading: "Introduction", body: ["Cette politique décrit les informations susceptibles d’être collectées et leur utilisation lorsque vous consultez xfontat."] },
        { heading: "Informations et utilisation", body: ["Les informations techniques et d’utilisation peuvent inclure le navigateur, les pages consultées et les interactions avec les fichiers de polices.", "Ces informations peuvent servir à maintenir et améliorer le site et à comprendre l’utilisation de ses fonctionnalités."] },
        { heading: "Cookies", body: ["Le site ou ses prestataires peuvent utiliser des cookies ou technologies similaires pour le fonctionnement et l’analyse. Vous pouvez gérer les cookies dans les paramètres de votre navigateur ; leur désactivation peut affecter certaines fonctions."] },
        { heading: "Sécurité et partage", body: ["Des mesures raisonnables protègent les informations, mais aucune transmission en ligne ni méthode de stockage électronique ne peut être garantie totalement sécurisée.", "Nous ne vendons pas de données personnelles. Des données agrégées peuvent être utilisées à des fins d’analyse ou partagées si nécessaire au service."] },
        { heading: "Vos choix et mises à jour", body: ["Vous pouvez nous contacter pour une demande ou question relative à la confidentialité. La politique peut être mise à jour ; la nouvelle version sera publiée sur cette page."] },
        { heading: "Contact", body: ["Pour toute question sur la confidentialité, écrivez à privacy@arabic-fonts.com."] },
      ],
    },
    terms: {
      title: "Conditions d’utilisation",
      description: "Consultez les conditions d’utilisation de xfontat et les licences propres à chaque fichier de police.",
      sections: [
        { heading: "Acceptation", body: ["En utilisant xfontat, vous acceptez ces conditions. Si vous ne les acceptez pas, n’utilisez pas le site."] },
        { heading: "Fichiers de polices et licences", body: ["Le téléchargement ne confère aucun droit au-delà de la licence applicable au fichier. Vérifiez la licence originale avant tout usage commercial, intégration, modification ou redistribution.", "Ne revendez pas et ne redistribuez pas des fichiers de polices séparément, sauf autorisation de la licence applicable. Respectez les droits des créateurs d’origine."] },
        { heading: "Propriété intellectuelle", body: ["Les fichiers restent soumis aux droits et licences de leurs propriétaires respectifs. xfontat ne remplace ni ne modifie ces conditions."] },
        { heading: "Usages interdits", body: ["N’utilisez pas le site de manière illégale, ne tentez pas d’accéder sans autorisation à ses systèmes, ne publiez pas de contenu nuisible, ne collectez pas automatiquement des données sans permission et ne portez pas atteinte aux droits d’autrui."] },
        { heading: "Limitation et responsabilité", body: ["Le site et les fichiers sont fournis selon leur disponibilité, sans garantie de service continu ni de fichiers sans erreur. Vérifiez les détails avant utilisation.", "Dans la mesure permise par la loi, xfontat ne répond pas des pertes indirectes ou consécutives liées à l’utilisation du site ou des fichiers."] },
        { heading: "Modifications et contact", body: ["Ces conditions peuvent être modifiées par publication d’une nouvelle version sur cette page. Pour toute question, écrivez à legal@arabic-fonts.com."] },
      ],
    },
  },
};
