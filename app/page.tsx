import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Services } from "@/components/site/services";
import { Barbers } from "@/components/site/barbers";
import { Lookbook } from "@/components/site/lookbook";
import { Testimonials } from "@/components/site/testimonials";
import { Location } from "@/components/site/location";
import { Footer } from "@/components/site/footer";
import { IntroStamp } from "@/components/site/intro-stamp";

export default function Home() {
  return (
    <>
      <IntroStamp />
      <Navbar />
      <main id="main">
        <Hero />
        <Services />
        <Barbers />
        <Lookbook />
        <Testimonials />
        <Location />
      </main>
      <Footer />
    </>
  );
}
