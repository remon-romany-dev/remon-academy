import type { Metadata } from "next";
import { Catalog } from "@/components/site/catalog";
import { ContactSection } from "@/components/site/contact-section";
import { Faq } from "@/components/site/faq";
import { Testimonials } from "@/components/site/testimonials";
import { CONTACT } from "@/content/contact";
import { FinalCta } from "@/components/site/final-cta";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { Instructor } from "@/components/site/instructor";
import { JsonLd } from "@/components/site/json-ld";
import { Stats } from "@/components/site/stats";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { Spotlight } from "@/components/ui/spotlight";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { courses, faqs, SITE_NAME, SITE_URL } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const organization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: "Remon Academy",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      description:
        "كورسات برمجة وتصميم وتسويق وذكاء اصطناعي وتحليل بيانات، أونلاين وحضوري، مع المدرّب ريمون رومانى.",
      founder: {
        "@type": "Person",
        name: "Remon Romany",
        alternateName: "ريمون رومانى",
        url: "https://remonromany.com",
        jobTitle: "Web Developer and Designer",
      },
      sameAs: [CONTACT.linkedin, CONTACT.portfolio],
      email: CONTACT.email,
      telephone: "+201270146047",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+201270146047",
        email: CONTACT.email,
        availableLanguage: ["ar"],
      },
      areaServed: "EG",
      availableLanguage: "ar",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "ar",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "ItemList",
      name: "كورسات أكاديمية ريمون",
      itemListElement: courses.map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/courses/${course.slug}`,
        name: course.title,
      })),
    },
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={faqLd} />
      <ScrollProgress />
      <CursorGlow />
      <Spotlight />
      <SiteHeader />
      <main>
        <Hero />
        <Stats />
        <Catalog />
        <HowItWorks />
        <Instructor />
        <Testimonials />
        <Faq />
        <ContactSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
