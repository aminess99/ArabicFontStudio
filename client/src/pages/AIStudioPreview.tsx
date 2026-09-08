type StudioPreviewProps = {
  src: string;
  title: string;
};

const MOCKUP_PREVIEW_ORIGIN =
  "https://955d86de-9f9a-4ec8-8766-9b8fb8c43f4b-00-2lqs5flswa0rs.picard.replit.dev";

function StudioPreview({ src, title }: StudioPreviewProps) {
  return (
    <main className="min-h-screen bg-[#08090b]">
      <iframe
        className="block h-screen min-h-[720px] w-full border-0"
        src={src}
        title={title}
        loading="eager"
      />
    </main>
  );
}

export function YouTubeThumbnailPreview() {
  return (
    <StudioPreview
      src={`${MOCKUP_PREVIEW_ORIGIN}/__mockup/preview/xfontat-ai-tools/YouTubeThumbnailMaker`}
      title="xfontat YouTube Thumbnail Maker preview"
    />
  );
}

export function PurpleLogoPreview() {
  return (
    <StudioPreview
      src={`${MOCKUP_PREVIEW_ORIGIN}/__mockup/preview/xfontat-ai-tools/LogoMakerPurple`}
      title="xfontat Arabic Logo Maker preview"
    />
  );
}