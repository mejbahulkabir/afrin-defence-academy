
import ContactForm from "@/components/marketing/sections/contact-form";
import { PageHeader } from "@/components/marketing/sections/page-header";
import { SITE } from "@/constants/site";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Get in touch" title="Talk to our admissions team" description="We're here Monday to Saturday, 9 AM to 7 PM IST." />
      <section className="py-20 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            {[
              { Icon: Phone, title: "Call us", value: SITE.phone, href: `tel:${SITE.phoneRaw}` },
              { Icon: Mail, title: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
              { Icon: MapPin, title: "Visit", value: SITE.address },
            ].map(({ Icon, title, value, href }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                <div className="bg-gradient-ocean flex h-11 w-11 items-center justify-center rounded-xl text-white"><Icon className="h-5 w-5" /></div>
                <div><div className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{title}</div>{href ? <a href={href} className="mt-1 block text-sm font-medium text-foreground hover:text-accent">{value}</a> : <p className="mt-1 text-sm text-foreground">{value}</p>}</div>
              </div>
            ))}
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe title="Afrin Defence Academy location" src={SITE.mapsEmbed} loading="lazy" className="h-72 w-full" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
          <ContactForm /> 
        </div>
      </section>
    </>
  )
}
