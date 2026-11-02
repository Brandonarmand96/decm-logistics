import { useEffect } from "react";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  FileCheck2,
  Globe2,
  Network,
  PackageCheck,
  ShieldCheck,
  Truck,
  Warehouse,
} from "lucide-react";

const marketingServices = [
  {
    icon: Truck,
    title: "Managed logistics",
    text: "Transport coordination, distribution, fleet support and accountable delivery from request to completion.",
  },
  {
    icon: Globe2,
    title: "Freight forwarding",
    text: "Cross-border movement planning, customs documentation and licensed-partner coordination.",
  },
  {
    icon: Boxes,
    title: "Procurement & delivery",
    text: "Sourcing, supplier comparison, purchasing control, inspection and final delivery.",
  },
  {
    icon: Warehouse,
    title: "Warehousing",
    text: "Stock handling, dispatch planning, regional distribution and documented handover.",
  },
  {
    icon: Network,
    title: "Supply-chain consulting",
    text: "Practical reviews of cost, supplier risk, inventory movement and operational performance.",
  },
  {
    icon: ShieldCheck,
    title: "Humanitarian logistics",
    text: "Controlled emergency procurement, distribution evidence and accountable programme reporting.",
  },
];

export function MarketingSite({ path }: { path: string }) {
  useEffect(() => {
    const pageDetails: Record<string, [string, string]> = {
      "/": [
        "DECM Nexus | Integrated Logistics & Consulting",
        "People-led logistics, procurement, warehousing and supply-chain coordination from strategy to delivery.",
      ],
      "/services": [
        "Services | DECM Nexus",
        "Explore managed logistics, freight forwarding, procurement, warehousing, consulting and humanitarian logistics services.",
      ],
      "/about": [
        "About | DECM Nexus",
        "Learn how DECM Nexus turns complex logistics and supply-chain requirements into coordinated, accountable delivery.",
      ],
      "/contact": [
        "Contact | DECM Nexus",
        "Share your logistics, procurement or supply-chain requirement with the DECM Nexus team.",
      ],
    };
    const [title, description] = pageDetails[path] ?? pageDetails["/"];
    const siteUrl = (
      import.meta.env.VITE_SITE_URL || "https://decmnexus.com"
    ).replace(/\/$/, "");
    const canonicalUrl = `${siteUrl}${path === "/" ? "/" : path}`;
    document.title = title;
    const setMeta = (
      selector: string,
      attribute: "name" | "property",
      key: string,
      content: string,
    ) => {
      let meta = document.querySelector<HTMLMetaElement>(selector);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
    );
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description,
    );
    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [path]);
  const page =
    path === "/services" ? (
      <ServicesMarketing />
    ) : path === "/about" ? (
      <AboutMarketing />
    ) : path === "/contact" ? (
      <ContactMarketing />
    ) : (
      <HomeMarketing />
    );
  return (
    <div className="marketing-site">
      <MarketingNav path={path} />
      {page}
      <MarketingFooter />
    </div>
  );
}

function MarketingNav({ path }: { path: string }) {
  return (
    <header className="marketing-nav">
      <a className="marketing-logo" href="/">
        <img
          src="/decm-nexus-logo.png"
          alt="DECM Nexus Integrated Logistics and Consulting Ltd"
        />
      </a>
      <nav aria-label="Website navigation">
        <a
          className={path === "/services" ? "active" : ""}
          aria-current={path === "/services" ? "page" : undefined}
          href="/services"
        >
          Services
        </a>
        <a
          className={path === "/about" ? "active" : ""}
          aria-current={path === "/about" ? "page" : undefined}
          href="/about"
        >
          About
        </a>
        <a
          className={`nav-contact${path === "/contact" ? " active" : ""}`}
          aria-current={path === "/contact" ? "page" : undefined}
          href="/contact"
        >
          Talk to our team
        </a>
      </nav>
      <a className="portal-link" href="/app">
        Client portal <ArrowRight />
      </a>
    </header>
  );
}

function RouteVisual() {
  return (
    <div
      className="route-visual"
      aria-label="Animated network connecting logistics services"
    >
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="orbit orbit-three" />
      <div className="route-core">
        <img src="/decm-nexus-app-icon.png" alt="" />
      </div>
      <span className="route-node node-one">
        <Truck />
        <b>Move</b>
      </span>
      <span className="route-node node-two">
        <Boxes />
        <b>Source</b>
      </span>
      <span className="route-node node-three">
        <Warehouse />
        <b>Store</b>
      </span>
      <span className="route-node node-four">
        <FileCheck2 />
        <b>Verify</b>
      </span>
      <i className="route-pulse pulse-one" />
      <i className="route-pulse pulse-two" />
    </div>
  );
}

function HomeMarketing() {
  return (
    <main>
      <section className="marketing-hero">
        <div className="marketing-hero-copy">
          <p className="hero-signal">
            <span />
            Integrated logistics across every handover
          </p>
          <h1>
            We make complex movement feel <em>under control.</em>
          </h1>
          <p className="hero-lede">
            From a single urgent delivery to an end-to-end supply chain, DECM
            Nexus plans, coordinates and verifies the work—manually or through
            our optional client portal.
          </p>
          <div className="hero-ctas">
            <a className="primary" href="/contact">
              Start a conversation <ArrowRight />
            </a>
            <a className="marketing-text-link" href="/services">
              Explore our services
            </a>
          </div>
          <div className="hero-proof">
            <span>
              <strong>One team</strong> across the journey
            </span>
            <span>
              <strong>One record</strong> of every decision
            </span>
            <span>
              <strong>One standard</strong> from plan to proof
            </span>
          </div>
        </div>
        <RouteVisual />
      </section>
      <section className="movement-band" aria-hidden="true">
        <div>PROCUREMENT</div>
        <i />
        <div>FREIGHT</div>
        <i />
        <div>WAREHOUSING</div>
        <i />
        <div>DISTRIBUTION</div>
        <i />
        <div>CONSULTING</div>
      </section>
      <section className="marketing-intro">
        <p>
          Connecting Solutions.
          <br />
          Delivering Excellence.
        </p>
        <div>
          <h2>Not another disconnected provider.</h2>
          <p>
            We coordinate the complete operational chain, so customers do not
            have to manage a different conversation at every handover.
          </p>
          <a href="/about">
            How we work <ArrowRight />
          </a>
        </div>
      </section>
      <section className="service-showcase">
        <div className="service-showcase-head">
          <h2>Built for the whole job.</h2>
          <a href="/services">
            View every service <ArrowRight />
          </a>
        </div>
        <div className="service-showcase-grid">
          {marketingServices.slice(0, 4).map((service, index) => (
            <a href="/services" key={service.title}>
              <span>0{index + 1}</span>
              <service.icon />
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <ArrowRight className="service-arrow" />
            </a>
          ))}
        </div>
      </section>
      <section className="outcome-paths">
        <header>
          <h2>Start with the outcome.</h2>
          <p>
            You do not need to know which logistics category fits. Tell us what
            must happen; we will connect the right services around it.
          </p>
        </header>
        <div className="outcome-paths-list">
          <article>
            <span>Keep operations moving</span>
            <p>
              Coordinate transport, storage and distribution around a real
              route, timeline and operating constraint.
            </p>
            <Truck />
          </article>
          <article>
            <span>Source without losing control</span>
            <p>
              Connect supplier comparison, purchasing, inspection and final
              delivery in one accountable workflow.
            </p>
            <PackageCheck />
          </article>
          <article>
            <span>Close with usable evidence</span>
            <p>
              Keep decisions, milestones, documents and delivery proof clear
              enough for teams, customers and programme reporting.
            </p>
            <FileCheck2 />
          </article>
        </div>
        <a href="/contact">
          Describe the outcome you need <ArrowRight />
        </a>
      </section>
      <section className="proof-story">
        <div className="proof-map">
          <span className="map-line line-a" />
          <span className="map-line line-b" />
          <i className="map-dot dot-a" />
          <i className="map-dot dot-b" />
          <i className="map-dot dot-c" />
          <p>Lagos</p>
          <p>Abuja</p>
          <p>Kano</p>
        </div>
        <div>
          <h2>Visibility without depending on software.</h2>
          <p>
            DECM Nexus can run the operation through direct coordination,
            documented updates and disciplined reporting. When a customer wants
            digital visibility, the client portal adds live access without
            replacing the human service.
          </p>
          <ul>
            <li>
              <CheckCircle2 />
              Clear ownership and communication
            </li>
            <li>
              <CheckCircle2 />
              Milestones, documents and evidence
            </li>
            <li>
              <CheckCircle2 />
              Manual-first service, digital when useful
            </li>
          </ul>
          <a className="primary" href="/contact">
            Discuss your requirement <ArrowRight />
          </a>
        </div>
      </section>
      <section className="closing-marquee">
        <p>
          Your goods. Your timeline. <strong>Our accountability.</strong>
        </p>
        <a href="/contact">
          Let’s move something <ArrowRight />
        </a>
      </section>
    </main>
  );
}

function ServicesMarketing() {
  return (
    <main className="marketing-page">
      <section className="page-hero">
        <div>
          <p>End-to-end capability</p>
          <h1>
            One partner.
            <br />
            Every critical handover.
          </h1>
        </div>
        <p>
          Choose one service or connect the full chain. Every engagement is
          shaped around the requirement, route, risk and evidence that matter.
        </p>
      </section>
      <section className="services-ledger">
        {marketingServices.map((service, index) => (
          <article key={service.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <service.icon />
            <div>
              <h2>{service.title}</h2>
              <p>{service.text}</p>
            </div>
            <ul>
              {index === 0 && (
                <>
                  <li>Route and movement planning</li>
                  <li>Fleet and partner coordination</li>
                  <li>Delivery confirmation</li>
                </>
              )}
              {index === 1 && (
                <>
                  <li>Import and export support</li>
                  <li>Customs documentation</li>
                  <li>Cross-border coordination</li>
                </>
              )}
              {index === 2 && (
                <>
                  <li>Supplier sourcing</li>
                  <li>Commercial comparison</li>
                  <li>Inspection and fulfilment</li>
                </>
              )}
              {index === 3 && (
                <>
                  <li>Receiving and stock handling</li>
                  <li>Dispatch planning</li>
                  <li>Regional distribution</li>
                </>
              )}
              {index === 4 && (
                <>
                  <li>Supply-chain assessment</li>
                  <li>Cost and risk review</li>
                  <li>Operational improvement</li>
                </>
              )}
              {index === 5 && (
                <>
                  <li>Emergency sourcing</li>
                  <li>Controlled distribution</li>
                  <li>Programme evidence</li>
                </>
              )}
            </ul>
          </article>
        ))}
      </section>
      <MarketingCTA
        title="Need a connected solution?"
        text="Tell us what must move, where it must go and what success looks like."
      />
    </main>
  );
}

function AboutMarketing() {
  return (
    <main className="marketing-page">
      <section className="page-hero">
        <div>
          <p>From Strategy to Delivery.</p>
          <h1>
            Serious logistics.
            <br />
            Human accountability.
          </h1>
        </div>
        <p>
          DECM Nexus exists to connect businesses, optimise supply chains and
          turn operational complexity into clear, coordinated action.
        </p>
      </section>
      <section className="mission-grid">
        <article>
          <span>Vision</span>
          <h2>
            To be Africa’s leading integrated logistics and consulting company.
          </h2>
          <p>
            Delivering innovative, reliable and sustainable solutions that
            connect businesses and drive economic growth.
          </p>
        </article>
        <article>
          <span>Mission</span>
          <h2>End-to-end service, delivered with operational excellence.</h2>
          <p>
            We combine logistics, procurement, transportation, warehousing,
            freight forwarding and consulting to help clients achieve
            efficiency, value and sustainable success.
          </p>
        </article>
      </section>
      <section className="approach-timeline">
        <header>
          <h2>How we take ownership.</h2>
          <p>
            A simple operating discipline keeps complex work understandable.
          </p>
        </header>
        {[
          [
            "01",
            "Understand",
            "Clarify the requirement, urgency, route, constraints and proof of success.",
          ],
          [
            "02",
            "Design",
            "Build the movement, sourcing or distribution plan around real conditions.",
          ],
          [
            "03",
            "Coordinate",
            "Own partners, documents, decisions, milestones and exceptions.",
          ],
          [
            "04",
            "Verify",
            "Close the work with evidence, commercial clarity and a usable record.",
          ],
        ].map((x) => (
          <article key={x[0]}>
            <span>{x[0]}</span>
            <h3>{x[1]}</h3>
            <p>{x[2]}</p>
          </article>
        ))}
      </section>
      <MarketingCTA
        title="Bring us the difficult brief."
        text="We will help turn it into a controlled plan."
      />
    </main>
  );
}

function ContactMarketing() {
  return (
    <main className="marketing-page contact-page">
      <section className="contact-hero">
        <div>
          <p>Start with the requirement</p>
          <h1>What needs to move?</h1>
          <p>
            Share the service, origin, destination, timing and any constraints.
            We will respond with the right next step.
          </p>
        </div>
        <div className="contact-panel">
          <span>Email enquiries</span>
          <a href="mailto:admin@decmnexus.com?subject=DECM%20Nexus%20service%20enquiry">
            admin@decmnexus.com <ArrowRight />
          </a>
          <p>For existing customers who have portal access:</p>
          <a className="secondary" href="/app">
            Open client portal
          </a>
        </div>
      </section>
      <section className="contact-prompts">
        <article>
          <Truck />
          <h2>Move goods</h2>
          <p>Tell us the route, cargo, timing and delivery conditions.</p>
        </article>
        <article>
          <Boxes />
          <h2>Source & deliver</h2>
          <p>Tell us what you need, quantity, specification and destination.</p>
        </article>
        <article>
          <Network />
          <h2>Improve operations</h2>
          <p>Tell us where cost, delays or visibility are creating pressure.</p>
        </article>
      </section>
      <section className="brief-guide">
        <header>
          <h2>A useful first brief.</h2>
          <p>
            Even incomplete information is enough to begin. These details help
            our team understand the requirement and identify the right next
            step.
          </p>
        </header>
        <div>
          <span>What is moving or being sourced?</span>
          <span>Where does the work begin and end?</span>
          <span>What timing or deadline matters?</span>
          <span>What constraints should we plan around?</span>
          <span>What evidence will confirm success?</span>
        </div>
        <a href="mailto:admin@decmnexus.com?subject=DECM%20Nexus%20project%20brief">
          Email your brief <ArrowRight />
        </a>
      </section>
    </main>
  );
}

function MarketingCTA({ title, text }: { title: string; text: string }) {
  return (
    <section className="marketing-cta">
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <a href="/contact">
        Start a conversation <ArrowRight />
      </a>
    </section>
  );
}

function MarketingFooter() {
  return (
    <footer className="marketing-footer">
      <img
        src="/decm-nexus-logo.png"
        alt="DECM Nexus Integrated Logistics and Consulting Ltd"
      />
      <div>
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/app">Client portal</a>
      </div>
      <p>Connecting Solutions. Delivering Excellence.</p>
    </footer>
  );
}
