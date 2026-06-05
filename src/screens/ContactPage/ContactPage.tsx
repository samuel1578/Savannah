import { FormEvent, useState } from "react";
import { MapPin } from "lucide-react";

import { Header } from "../../components/Header";
import { MenuOverlay } from "../../components/MenuOverlay";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import luxuryExperience from "../../assets/luxury.png";
import originMap from "../../assets/map.png";
import { FooterBrandInviteSection } from "../Homepage/sections/FooterBrandInviteSection";

const experienceTypes = [
  "Private tasting",
  "Hospitality partner",
  "Luxury venue",
  "Press inquiry",
];

export const ContactPage = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#242514]">
      <Header onMenuOpen={() => setIsMenuOpen(true)} />

      <section className="relative min-h-screen overflow-hidden bg-[#fafafa] px-6 pb-16 pt-[90px] sm:px-10 lg:px-16 lg:pb-24 lg:pt-[100px]">
        <div className="mx-auto grid max-w-[1540px] gap-12 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-center lg:gap-20">
          <aside className="flex flex-col items-start">
            <h1 className="[font-family:'Cormorant_Unicase',Helvetica] text-[72px] font-light lowercase leading-[0.9] sm:text-[104px] lg:text-[128px]">
              visit
              <br />
              us
            </h1>

            <div className="mt-10 space-y-7 [font-family:'Raleway',Helvetica] text-sm leading-[1.7] text-[#242514]/75">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Accra%2C+Ghana"
                target="_blank"
                rel="noreferrer"
                className="block hover:text-[#242514]"
              >
                Savannah Water Studio
                <br />
                Accra, Ghana
                <br />
                Available worldwide
              </a>
              <p>
                Tasting Room By Appointment
                <br />
                11AM - 5 PM
              </p>
              <a href="mailto:hello@savannahwater.com" className="block hover:text-[#242514]">
                hello@savannahwater.com
              </a>
            </div>
          </aside>

          <div className="relative h-[420px] overflow-hidden sm:h-[560px] lg:h-[720px]">
            <img
              src={luxuryExperience}
              alt="Guests enjoying Savannah Water during a private tasting"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-24">
          <form onSubmit={handleSubmit} className="grid gap-8 [font-family:'Raleway',Helvetica]">
            <label className="block">
              <span className="sr-only">Name</span>
              <Input
                name="name"
                placeholder="Name"
                className="h-11 rounded-none border-0 border-b border-[#d7d7d7] bg-transparent px-0 text-sm text-[#242514] shadow-none placeholder:text-[#2a2a2a]/65 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </label>

            <div className="grid gap-8 sm:grid-cols-2">
              <label className="block">
                <span className="sr-only">Experience Type</span>
                <select
                  name="experience"
                  className="h-11 w-full rounded-none border-0 border-b border-[#d7d7d7] bg-transparent px-0 text-sm text-[#2a2a2a]/70 outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Experience Type
                  </option>
                  {experienceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="sr-only">Preferred Date</span>
                <Input
                  name="date"
                  type="date"
                  className="h-11 rounded-none border-0 border-b border-[#d7d7d7] bg-transparent px-0 text-sm text-[#2a2a2a]/70 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </label>
            </div>

            <label className="block">
              <span className="sr-only">Email</span>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                className="h-11 rounded-none border-0 border-b border-[#d7d7d7] bg-transparent px-0 text-sm text-[#242514] shadow-none placeholder:text-[#2a2a2a]/65 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </label>

            <label className="block">
              <span className="sr-only">Message</span>
              <textarea
                name="message"
                placeholder="Message"
                rows={5}
                className="w-full resize-none rounded-none border-0 border-b border-[#d7d7d7] bg-transparent px-0 py-2 text-sm text-[#242514] outline-none placeholder:text-[#2a2a2a]/65"
              />
            </label>

            <div>
              <Button
                type="submit"
                variant="ghost"
                className="h-auto rounded-none px-0 [font-family:'Bellefair',Helvetica] text-[23px] font-normal tracking-[1px] text-[#242514] hover:bg-transparent hover:text-[#242514]/70"
              >
                Submit
              </Button>
              <p className="mt-3 [font-family:'Bellefair',Helvetica] text-[21px] leading-[1.45] tracking-[1px] text-[#242514]">
                Curated experiences for hospitality partners, luxury venues, and private tastings.
              </p>
            </div>
          </form>

          <h2 className="[font-family:'Cormorant_Unicase',Helvetica] text-[58px] font-light lowercase leading-[0.86] text-[#242514] sm:text-[76px] lg:text-[92px]">
            experience
            <br />
            savannah
            <br />
            water
            <br />
            beyond
            <br />
            the bottle
          </h2>
        </div>
      </section>

      <section className="relative h-[360px] overflow-hidden bg-[#e5e3df] sm:h-[440px] lg:h-[520px]">
        <img
          src={originMap}
          alt="Map showing Savannah Water origin in Ghana"
          className="h-full w-full object-cover opacity-20 grayscale"
        />
        <div className="absolute inset-0 bg-white/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center [font-family:'Raleway',Helvetica] text-sm uppercase tracking-[1px] text-[#242514]">
            <MapPin className="h-10 w-10" aria-hidden="true" />
            <span>Accra, Ghana</span>
          </div>
        </div>
      </section>

      <FooterBrandInviteSection />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} activeSection="contact" />
    </main>
  );
};
