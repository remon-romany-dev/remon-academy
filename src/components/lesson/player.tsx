export function LessonPlayer({ title, embedUrl }: { title: string; embedUrl?: string }) {
  if (embedUrl) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-black">
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-line bg-black/40 p-6">
      <p className="text-base leading-7 text-muted">
        الدرس متاح للمذاكرة. الفيديو لسه مش متترفع. لما يتحط رابط يوتيوب أو رقم فيديو Bunny من لوحة الإدارة هيشتغل في المكان ده.
      </p>
    </div>
  );
}
