const loadedFonts = new Set<string>();
let styleElement: HTMLStyleElement | null = null;

function getStyleElement(): HTMLStyleElement {
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'dynamic-fonts';
    document.head.appendChild(styleElement);
  }
  return styleElement;
}

function getFontFormat(fileUrl: string): string | null {
  const ext = fileUrl.split('.').pop()?.toLowerCase();
  
  const formatMap: Record<string, string> = {
    'ttf': 'truetype',
    'otf': 'opentype',
    'woff': 'woff',
    'woff2': 'woff2'
  };
  
  return ext ? (formatMap[ext] || null) : null;
}

export async function loadFont(fontFamily: string, fontUrl: string): Promise<void> {
  const fontKey = `${fontFamily}-${fontUrl}`;
  
  if (loadedFonts.has(fontKey)) {
    return;
  }

  const encodedUrl = fontUrl.split('/').map(part => encodeURIComponent(part)).join('/');
  const format = getFontFormat(fontUrl);
  const formatString = format ? ` format("${format}")` : '';
  
  const fontFaceRule = `
    @font-face {
      font-family: "${fontFamily}";
      src: url("${encodedUrl}")${formatString};
      font-weight: normal;
      font-style: normal;
    }
  `;
  
  const style = getStyleElement();
  style.textContent += fontFaceRule;
  
  loadedFonts.add(fontKey);
  
  await new Promise(resolve => setTimeout(resolve, 10));
}

export function generateFontFamily(fontName: string): string {
  return `font-${fontName.replace(/[^a-zA-Z0-9]/g, '-')}`;
}
