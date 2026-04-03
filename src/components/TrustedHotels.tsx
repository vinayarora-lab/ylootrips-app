import Image from 'next/image';

const hotels = [
  { name: 'Taj Hotels & Resorts',  logo: '/hotels/taj.svg',      sub: 'IHCL · Est. 1903' },
  { name: 'The Oberoi',            logo: '/hotels/oberoi.svg',   sub: 'Hotels & Resorts' },
  { name: 'ITC Hotels',            logo: '/hotels/itc.svg',      sub: 'Luxury Collection' },
  { name: 'The Leela',             logo: '/hotels/leela.svg',    sub: 'Palaces & Resorts' },
  { name: 'Marriott',              logo: '/hotels/marriott.svg', sub: 'International' },
  { name: 'Rambagh Palace',        logo: '/hotels/rambagh.svg',  sub: 'Jaipur · Heritage' },
  { name: 'Trident Hotels',        logo: '/hotels/trident.svg',  sub: 'by Oberoi Group' },
  { name: 'The Lalit',             logo: '/hotels/lalit.svg',    sub: 'Luxury Hotels' },
];

export default function TrustedHotels() {
  return (
    <section className="py-10 md:py-14 bg-cream-dark border-y border-primary/8">
      <div className="section-container">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-primary/40 mb-2">Our Partner Hotels</p>
          <h3 className="font-display text-2xl md:text-3xl text-primary">
            Staying in <span className="italic">India&apos;s finest</span>
          </h3>
          <p className="text-sm text-primary/45 mt-2">
            Every hotel is hand-selected and pre-inspected — boutique havelis to 5-star palace hotels.
          </p>
        </div>

        {/* Logo grid — scroll on mobile */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-4 min-w-max md:min-w-0 md:grid md:grid-cols-4 lg:grid-cols-8">
            {hotels.map(({ name, logo }) => (
              <div
                key={name}
                className="group bg-white border border-primary/10 hover:border-primary/25 hover:shadow-md transition-all duration-300 flex items-center justify-center p-4 w-[130px] h-[90px] md:w-auto md:h-[90px]"
              >
                <Image
                  src={logo}
                  alt={`${name} logo`}
                  width={120}
                  height={70}
                  className="object-contain w-full h-full opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-primary/30 uppercase tracking-widest mt-6">
          + 200 more curated properties across India
        </p>
      </div>
    </section>
  );
}
