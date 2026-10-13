import { CTASection } from "@/components/marketing/cta-section";
import DisciplineMentorshipResults from "@/components/marketing/sections/discipline-entorship-results";
import OurMissionStory from "@/components/marketing/sections/our-mission-story";
import { PageHeader } from "@/components/marketing/sections/page-header";
import { StatsBand } from "@/components/marketing/sections/stats";
import { WhyUs } from "@/components/marketing/sections/why-us";


export default function AboutPage() {
    return (
        <>
            <PageHeader eyebrow="About the Academy" title="Eighteen years of training India's officers" description="Founded in 2007 by serving and retired officers, Afrin Defence Academy has prepared over 12,500 aspirants for the Indian Armed Forces with measurable, repeatable results." />
            <OurMissionStory />
            <StatsBand />
            <DisciplineMentorshipResults />
            <WhyUs />
            <CTASection />
        </>
    )
}
