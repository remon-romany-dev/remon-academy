type JsonLdProps = {
  data: Record<string, unknown>;
};

/** بيانات منظمة (Schema.org) للمحركات. الـ < بتتهرّب عشان الـ script يفضل آمن. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
