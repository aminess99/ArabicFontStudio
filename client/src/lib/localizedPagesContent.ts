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

type LocalizedStaticSection = {
  heading: string;
  paragraphs?: string[];
  body?: string[];
  items?: string[];
};

type LocalizedStaticPage = {
  title: string;
  description: string;
  sections: LocalizedStaticSection[];
};

export const localizedStaticPages: Record<SiteLocale, {
  about: LocalizedStaticPage;
  contact: { title: string; description: string; heading: string; intro: string; form: string[] };
  privacy: LocalizedStaticPage;
  terms: LocalizedStaticPage;
}> = {
  en: {
    about: {
      title: "About xfontat",
      description: "Learn about xfontat, a directory for browsing and previewing Arabic font files and checking available file details.",
      sections: [
        { heading: "Welcome to xfontat", paragraphs: ["xfontat is a directory for browsing and previewing Arabic fonts. File formats and usage terms vary, so review the details and license for each file.", "Our aim is to make it easier to explore Arabic typefaces and preview them with different text before downloading."] },
        { heading: "Our mission", paragraphs: ["We organize the listed font files and provide previews that help designers, developers, and writers test text before downloading.", "We aim to improve the available font information and make source, format, and license details easier to find when available."] },
        { heading: "Using the directory", paragraphs: ["The category pages describe the digital files listed in the directory; they are not a substitute for specialist historical references.", "When historical information or attribution is added, it should include a source readers can verify."] },
        { heading: "Arabic font styles in the directory", paragraphs: ["The directory groups digital font files under these category labels. The labels are for browsing and do not establish historical origins or classifications."], items: ["Thuluth — a decorative style often used for artwork and headings; test it where details remain legible.", "Diwani — a flowing decorative style that can be tested for invitations, certificates, and headings.", "Ruqah — a compact style to test in handwriting-like uses and short headings; digital legibility depends on the font and size.", "Kufi — a category containing varied styles, including geometric forms for logos and visual work.", "Naskh — commonly encountered in reading and print; test each font and size against the actual content.", "Design fonts — visual styles to explore for advertising, posts, and design projects.", "Expressive fonts — decorative styles to test in headings, posters, and visual design.", "Photoshop fonts — files to test in design software that supports their formats; Arabic support varies by program and version.", "Nastaliq — a style associated with Persian and Urdu calligraphy and used in some literary and decorative contexts."] },
        { heading: "Arabic typography in modern digital design", paragraphs: ["Digital publishing makes Arabic fonts available in files that can be used on compatible devices and software, alongside traditional writing and printing methods.", "Arabic digital design requires attention to text direction, connected letter shaping, and diacritics. Test fonts on the operating systems and browsers you target, and review each file’s details before use.", "For Arabic interfaces, set the correct HTML direction and test text, sizes, and spacing across devices. No single spacing value works for every font and screen."] },
        { heading: "What xfontat offers", paragraphs: ["Features available on the website include:"], items: ["Free downloads for files marked as available; check each font’s license before use or redistribution.", "Interactive previews so you can enter text and see how it looks before downloading.", "Categories for exploring the font files listed in the directory.", "Articles about Arabic fonts and their use in design.", "An Arabic-first interface with right-to-left layout support.", "File, format, and license details when available."] },
        { heading: "Our vision for the future", paragraphs: ["We aim for xfontat to grow beyond a font directory and serve the Arabic design community, from beginners looking for a first font to professionals and researchers studying Arabic typography.", "We are working toward integrated design tools for customizing fonts on the platform and a search experience that can suggest fonts from a project description."] },
      ],
    },
    contact: {
      title: "Contact xfontat",
      description: "Contact xfontat about the Arabic font directory, file information, or website issues.",
      heading: "Get in touch",
      intro: "Choose the address that best matches your question. For font usage rights, include the font name and its source page.",
      form: ["Send us a message", "Name", "Enter your name", "Email address", "Enter your email address", "Subject", "Message subject", "Message", "Write your message here…", "Send message", "We’ll reply as soon as possible. Thank you for contacting us!"],
    },
    privacy: {
      title: "Privacy policy",
      description: "Read how xfontat handles information when you use the website.",
      sections: [
        { heading: "Introduction", body: ["Last updated: November 2025.", "We respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and protect information when you use our website."] },
        { heading: "Information we collect", body: ["We may collect the following types of information:"], items: ["Browsing information, including IP address, browser type, and pages you visit.", "Usage information, such as the fonts you browse and download.", "Cookies used to improve the user experience."] },
        { heading: "How we use your information", body: ["We use the information we collect for the following purposes:"], items: ["Improve our services and user experience.", "Analyze patterns in how the website is used.", "Save your preferences, such as dark or light mode.", "Provide content tailored to your interests."] },
        { heading: "Cookies", body: ["We use cookies to improve your experience on the website. You can manage cookie preferences in your browser settings. Disabling cookies may affect some website functions."] },
        { heading: "Data protection", body: ["We take appropriate security measures to protect information from unauthorized access, alteration, disclosure, or destruction. However, no method of online transmission or electronic storage is 100% secure."] },
        { heading: "Information sharing", body: ["We do not sell, rent, or share personal information with third parties for marketing purposes. Aggregated and non-identifying information may be shared for analytics."] },
        { heading: "Your rights", body: ["You have the following rights regarding your data:"], items: ["The right to access your personal data.", "The right to correct inaccurate data.", "The right to request deletion of your data.", "The right to object to processing of your data."] },
        { heading: "Changes to this policy", body: ["We may update this privacy policy from time to time. Any changes will be posted on this page with a new last-updated date."] },
        { heading: "Contact", body: ["For questions about this privacy policy, contact privacy@arabic-fonts.com."] },
      ],
    },
    terms: {
      title: "Terms of use",
      description: "Review the terms for using xfontat and the separate license conditions that apply to font files.",
      sections: [
        { heading: "Acceptance of terms", body: ["Last updated: November 2025.", "By using xfontat, you agree to comply with these terms and conditions. If you do not agree, please do not use the website."] },
        { heading: "Use of fonts", body: ["Fonts on this website are provided for use under the following conditions:"], items: ["You may download fonts for free; commercial use is subject to the license for each individual font.", "You may not resell fonts or distribute them as separate font files.", "You may embed fonts in your projects and products.", "Please respect the intellectual property rights of the original designers."] },
        { heading: "Intellectual property rights", body: ["All fonts available on the website belong to their respective owners and designers. We provide these fonts as a service to the community and respect the intellectual property rights of all creators."] },
        { heading: "Restrictions on use", body: ["You are prohibited from:"], items: ["Using the website in a way that violates local or international laws.", "Attempting unauthorized access to the website’s systems.", "Publishing harmful or abusive content through the website.", "Using automated software to collect website data without permission.", "Infringing the intellectual property rights of any party."] },
        { heading: "Disclaimer", body: ["The fonts and services are provided “as is” without warranties of any kind. We do not guarantee that fonts will be error-free or that the website will operate without interruption. Your use of the website and fonts is at your own risk."] },
        { heading: "Limitation of liability", body: ["We are not liable for direct, indirect, incidental, special, or consequential damages resulting from the use of, or inability to use, the website or fonts."] },
        { heading: "Changes", body: ["We reserve the right to modify these terms at any time. Changes will be posted on this page with a new last-updated date. Continued use of the website after changes means you accept them."] },
        { heading: "Governing law", body: ["These terms are governed by and interpreted in accordance with applicable laws, without regard to conflict-of-law provisions."] },
        { heading: "Contact", body: ["For questions about these terms, contact legal@arabic-fonts.com."] },
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
        { heading: "Styles de polices arabes du répertoire", paragraphs: ["Le répertoire regroupe les fichiers sous les catégories suivantes. Ces intitulés facilitent la navigation et ne constituent pas une classification historique."], items: ["Thuluth — style décoratif souvent utilisé pour des œuvres et des titres ; testez-le à une taille où les détails restent lisibles.", "Diwani — style ornemental fluide à tester pour des invitations, certificats et titres.", "Ruqah — style compact à tester pour des usages manuscrits et des titres courts ; la lisibilité numérique dépend de la police et de sa taille.", "Kufi — catégorie qui réunit divers styles, notamment des formes géométriques pour les logos et les visuels.", "Naskh — rencontré dans la lecture et l’imprimé ; testez chaque police et taille avec le contenu réel.", "Polices de design — styles visuels à explorer pour la publicité, les publications et les projets graphiques.", "Polices expressives — styles décoratifs à tester pour les titres, affiches et créations visuelles.", "Polices pour Photoshop — fichiers à tester dans les logiciels compatibles avec leur format ; la prise en charge de l’arabe varie selon le programme et sa version.", "Nastaliq — style associé à la calligraphie persane et ourdoue, utilisé dans certains contextes littéraires et décoratifs."] },
        { heading: "Typographie arabe dans le design numérique moderne", paragraphs: ["La publication numérique permet d’utiliser des fichiers de polices arabes sur les appareils et logiciels compatibles, en complément des moyens traditionnels d’écriture et d’impression.", "Le design numérique arabe demande de prêter attention au sens d’écriture, à la liaison des lettres et aux signes diacritiques. Testez les polices sur les systèmes et navigateurs visés, et consultez les détails de chaque fichier avant usage.", "Pour une interface arabe, définissez le bon sens d’écriture HTML et testez le texte, les tailles et l’espacement sur différents appareils. Aucune valeur d’espacement ne convient à toutes les polices et à tous les écrans."] },
        { heading: "Ce que propose xfontat", paragraphs: ["Le site propose notamment :"], items: ["Téléchargement gratuit des fichiers indiqués comme disponibles ; vérifiez la licence de chaque police avant usage ou redistribution.", "Aperçus interactifs pour saisir votre texte et voir le rendu avant le téléchargement.", "Catégories pour explorer les fichiers répertoriés.", "Articles sur les polices arabes et leur utilisation en design.", "Une interface pensée pour l’arabe avec prise en charge du sens droite-gauche.", "Informations sur les fichiers, formats et licences lorsqu’elles sont disponibles."] },
        { heading: "Notre vision pour l’avenir", paragraphs: ["Nous souhaitons que xfontat dépasse le cadre d’un répertoire et accompagne la communauté du design arabe : des débutants aux professionnels et aux chercheurs en typographie arabe.", "Nous travaillons à des outils de design intégrés pour personnaliser les polices sur la plateforme, ainsi qu’à une recherche capable de suggérer des polices à partir de la description d’un projet."] },
      ],
    },
    contact: {
      title: "Contacter xfontat",
      description: "Contactez xfontat au sujet du répertoire de polices arabes, des informations sur les fichiers ou d’un problème du site.",
      heading: "Nous contacter",
      intro: "Choisissez l’adresse correspondant à votre demande. Pour une question de droits d’utilisation, indiquez le nom de la police et sa page source.",
      form: ["Envoyez-nous un message", "Nom", "Saisissez votre nom", "Adresse e-mail", "Saisissez votre adresse e-mail", "Objet", "Objet du message", "Message", "Rédigez votre message ici…", "Envoyer le message", "Nous vous répondrons dès que possible. Merci de nous avoir contactés !"],
    },
    privacy: {
      title: "Politique de confidentialité",
      description: "Découvrez comment xfontat traite les informations lors de l’utilisation du site.",
      sections: [
        { heading: "Introduction", body: ["Dernière mise à jour : novembre 2025.", "Nous respectons votre vie privée et nous engageons à protéger vos données personnelles. Cette politique explique comment nous recueillons, utilisons et protégeons les informations lorsque vous utilisez notre site."] },
        { heading: "Informations recueillies", body: ["Nous pouvons recueillir les types d’informations suivants :"], items: ["Informations de navigation, notamment l’adresse IP, le type de navigateur et les pages consultées.", "Informations d’utilisation, telles que les polices consultées et téléchargées.", "Cookies utilisés pour améliorer l’expérience utilisateur."] },
        { heading: "Utilisation de vos informations", body: ["Nous utilisons les informations recueillies aux fins suivantes :"], items: ["Améliorer nos services et l’expérience utilisateur.", "Analyser les habitudes d’utilisation du site.", "Enregistrer vos préférences, par exemple le mode sombre ou clair.", "Proposer du contenu adapté à vos centres d’intérêt."] },
        { heading: "Cookies", body: ["Nous utilisons des cookies pour améliorer votre expérience sur le site. Vous pouvez gérer vos préférences dans les paramètres de votre navigateur. Leur désactivation peut affecter certaines fonctions."] },
        { heading: "Protection des données", body: ["Nous prenons des mesures de sécurité appropriées contre l’accès, la modification, la divulgation ou la destruction non autorisés des informations. Toutefois, aucune transmission en ligne ni méthode de stockage électronique n’est sécurisée à 100 %."] },
        { heading: "Partage des informations", body: ["Nous ne vendons, ne louons ni ne partageons de données personnelles avec des tiers à des fins marketing. Des informations agrégées et non identifiantes peuvent être partagées à des fins d’analyse."] },
        { heading: "Vos droits", body: ["Vous disposez des droits suivants concernant vos données :"], items: ["Le droit d’accéder à vos données personnelles.", "Le droit de rectifier des données inexactes.", "Le droit de demander la suppression de vos données.", "Le droit de vous opposer au traitement de vos données."] },
        { heading: "Modifications de cette politique", body: ["Nous pouvons mettre à jour cette politique de confidentialité. Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour."] },
        { heading: "Contact", body: ["Pour toute question sur cette politique, contactez privacy@arabic-fonts.com."] },
      ],
    },
    terms: {
      title: "Conditions d’utilisation",
      description: "Consultez les conditions d’utilisation de xfontat et les licences propres à chaque fichier de police.",
      sections: [
        { heading: "Acceptation des conditions", body: ["Dernière mise à jour : novembre 2025.", "En utilisant xfontat, vous acceptez de respecter ces conditions. Si vous ne les acceptez pas, veuillez ne pas utiliser le site."] },
        { heading: "Utilisation des polices", body: ["Les polices du site sont mises à disposition selon les conditions suivantes :"], items: ["Vous pouvez télécharger les polices gratuitement ; l’usage commercial dépend de la licence de chaque police.", "Vous ne pouvez pas revendre les polices ni les distribuer comme fichiers de police séparés.", "Vous pouvez intégrer les polices à vos projets et produits.", "Veuillez respecter les droits de propriété intellectuelle des créateurs d’origine."] },
        { heading: "Droits de propriété intellectuelle", body: ["Toutes les polices disponibles sur le site appartiennent à leurs propriétaires et créateurs respectifs. Nous les proposons au service de la communauté et respectons les droits de tous les créateurs."] },
        { heading: "Restrictions d’utilisation", body: ["Il vous est interdit de :"], items: ["Utiliser le site d’une manière contraire aux lois locales ou internationales.", "Tenter d’accéder sans autorisation aux systèmes du site.", "Publier du contenu nuisible ou abusif sur le site.", "Utiliser des outils automatisés pour collecter des données du site sans autorisation.", "Porter atteinte aux droits de propriété intellectuelle d’un tiers."] },
        { heading: "Exclusion de garantie", body: ["Les polices et services sont fournis « en l’état », sans garantie d’aucune sorte. Nous ne garantissons ni l’absence d’erreurs dans les polices ni le fonctionnement continu du site. Vous utilisez le site et les polices à vos propres risques."] },
        { heading: "Limitation de responsabilité", body: ["Nous ne sommes pas responsables des dommages directs, indirects, accessoires, spéciaux ou consécutifs résultant de l’utilisation du site ou des polices, ou de l’impossibilité de les utiliser."] },
        { heading: "Modifications", body: ["Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour. En continuant à utiliser le site, vous acceptez les modifications."] },
        { heading: "Droit applicable", body: ["Ces conditions sont régies et interprétées conformément aux lois applicables, sans égard aux règles de conflit de lois."] },
        { heading: "Contact", body: ["Pour toute question sur ces conditions, contactez legal@arabic-fonts.com."] },
      ],
    },
  },
};
