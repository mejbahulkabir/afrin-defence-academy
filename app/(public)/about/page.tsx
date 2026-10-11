import { CTASection } from '@/components/custom/cta-section';
import { SectionHeading } from '@/components/custom/section-heading';
import DisciplineMentorshipResults from '@/components/sections/discipline-entorship-results';
import OurMissionStory from '@/components/sections/our-mission-story';
import { PageHeader } from '@/components/sections/page-header';
import { StatsBand } from '@/components/sections/stats';
import { WhyUs } from '@/components/sections/why-us';
import { Award, Compass, Target, Users } from 'lucide-react';

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
