import {Hero} from '../components/landing/Hero';
import {PrimaryFeatures} from '../components/landing/PrimaryFeatures';
import {SecondaryFeatures} from '../components/landing/SecondaryFeatures';
import {Testimonials} from '../components/landing/Testimonials';
import {Pricing} from '../components/landing/Pricing';
import {Faqs} from '../components/landing/Faqs';
import {Footer} from '../components/landing/Footer';
import {CallToAction} from '../components/landing/CallToAction';
import {Header} from '../components/landing/Header';

export default function Home() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                {/*<PrimaryFeatures />*/}
                {/*<SecondaryFeatures />*/}
                {/*<CallToAction />*/}
                {/*<Pricing />*/}
                {/*<Faqs />*/}
            </main>
            <Footer />
        </>
    )
}
