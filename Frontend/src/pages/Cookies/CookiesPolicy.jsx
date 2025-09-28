import React from "react";

const CookiesPolicy = () => {
  return (
    <div className="page-container">
      <div className="card">
        <h1 className="page-title">Privacy &amp; Cookies Policy</h1>
        <p className="page-updated">Last updated: September 27, 2025</p>

        {/* ───────────────────────── Intro ───────────────────────── */}
        <section className="policy-section">
          <p>
            This Privacy &amp; Cookies Policy describes how <strong>GOLDfren</strong> (“we”, “our”, “us”)
            collects, uses and discloses your personal information when you use our public catalogue at{" "}
            <a className="link" href="https://catalog.goldfren.cz" target="_blank" rel="noopener noreferrer">
              catalog.goldfren.cz
            </a>{" "}
            or{" "}
            <a className="link" href="https://catalog.goldfren.com" target="_blank" rel="noopener noreferrer">
              catalog.goldfren.com
            </a>
            . It also explains your privacy rights under the EU/EEA GDPR and other applicable laws.
          </p>
          <p>
            We use your personal data only to provide and improve the Service. Non-essential cookies (analytics / optional
            geolocation) are used only after your consent. You can manage or withdraw your consent at any time via the
            “Manage cookies &amp; consent” control (usually in the footer).
          </p>
        </section>

        {/* ───────────────────── Who we are ─────────────────────── */}
        <section className="policy-section">
          <h2>Who We Are (Controller)</h2>
          <p>
            <strong>GOLDfren</strong>, Poběžovice u Holic 130, 534 01 Poběžovice u Holic, Czechia.
          </p>
          <p>
            Contact:{" "}
            <a className="link" href="mailto:goldfren@goldfren.cz">
              goldfren@goldfren.cz
            </a>
            .
          </p>
        </section>

        {/* ───────────────────── Definitions ─────────────────────── */}
        <section className="policy-section">
          <h2>Interpretation and Definitions</h2>
          <h3>Interpretation</h3>
          <p>
            Words whose initial letter is capitalised have meanings defined below. The same definitions apply whether they
            appear in singular or plural.
          </p>
          <h3>Definitions</h3>
          <ul>
            <li>
              <strong>Cookies</strong> – small text files stored in your browser that help us remember preferences and
              analyse traffic.
            </li>
            <li>
              <strong>Usage Data</strong> – technical information such as page visits, browser type, device model and
              anonymised IP-based region.
            </li>
            <li>
              <strong>Service</strong> – the public GOLDfren catalogue available at the URLs above.
            </li>
            <li>
              <strong>Service Provider / Processor</strong> – third parties that process data on our behalf (e.g. Google
              for analytics).
            </li>
            <li>
              <strong>You / Data Subject</strong> – a visitor using the Service.
            </li>
          </ul>
        </section>

        {/* ───────────────────── Legal Basis ─────────────────────── */}
        <section className="policy-section">
          <h2>Legal Basis for Processing (GDPR Art. 6)</h2>
          <p>We process personal data only where at least one lawful basis applies:</p>
          <ul>
            <li>
              your <strong>consent</strong> for analytics &amp; optional geolocation cookies (Art 6(1)(a));
            </li>
            <li>
              <strong>performance of a contract</strong> or steps at your request prior to a contract when you contact us
              about products (Art 6(1)(b));
            </li>
            <li>
              our <strong>legitimate interest</strong> in keeping the catalogue secure and functional (Art 6(1)(f));
            </li>
            <li>
              <strong>compliance with legal obligations</strong> (Art 6(1)(c)).
            </li>
          </ul>
        </section>

        {/* ─────────────── Collecting & Using Data ───────────────── */}
        <section className="policy-section">
          <h2>Collecting and Using Your Personal Data</h2>
          <h3>Types of Data Collected</h3>
          <p>We do not require you to create an account. We collect only:</p>
          <ul>
            <li>Usage Data described below;</li>
            <li>information you voluntarily send us via email or forms.</li>
          </ul>

          <h3 className="mt-4">Usage Data</h3>
          <p>
            Usage Data is collected automatically and may include your browser type, device model, language preference,
            anonymised IP-based region, date/time of visits, pages viewed and time spent on each page.
          </p>

          <h3>Analytics (GA4) &amp; Search-term Tracking</h3>
          <p>
            We use <strong>Google Analytics 4 (GA4)</strong> to understand how visitors use the catalogue. GA4{" "}
            <strong>anonymises IP addresses</strong> before storage so we never see the full IP. We also record{" "}
            <strong>search terms</strong> entered in the catalogue search bar to understand product demand. These data are
            not linked to an identified person.
          </p>
          <p>
            We use Google’s <strong>Consent Mode v2</strong> to respect your choices. When analytics consent is not given,
            GA4 operates in a limited way (no cookies, modelled/aggregated signals only) or is blocked depending on your
            settings.
          </p>

          <h3>Optional Geolocation</h3>
          <p>
            If you <strong>consent</strong> via the cookie banner, the browser may share <strong>approximate city-level
            location</strong> so we can analyse regional interest. Refusing or withdrawing this consent will not affect
            your access to the catalogue.
          </p>
        </section>

        {/* ─────────────────── Cookies ──────────────────────────── */}
        <section className="policy-section">
          <h2>Tracking Technologies and Cookies</h2>
          <p>
            We use both <strong>session</strong> cookies (deleted when you close the browser) and{" "}
            <strong>persistent</strong> cookies (kept for a limited time) for the following purposes:
          </p>
          <ul>
            <li>
              <strong>Essential Cookies</strong> – required for core functionality and security.
            </li>
            <li>
              <strong>Consent Cookie</strong> – remembers whether you accepted or rejected analytics/geolocation cookies.
            </li>
            <li>
              <strong>Statistics / Performance Cookies</strong> – GA4 cookies helping us measure visits, pages viewed,
              search terms and approximate region (enabled only with consent).
            </li>
          </ul>
          <p className="mt-4">
            Non-essential cookies remain disabled until you provide consent through the banner. You may withdraw or change
            your choice anytime via “Manage cookies &amp; consent” or in your browser settings.
          </p>
          <p>
            <em>Advertising/marketing cookies:</em> We do <strong>not</strong> use advertising or remarketing cookies on
            the catalogue. If this changes, we will request separate consent and update this Policy.
          </p>
        </section>

        {/* ─────────────────── Use of Data ───────────────────────── */}
        <section className="policy-section">
          <h2>Use of Your Personal Data</h2>
          <ul>
            <li>To operate, secure and improve the Service;</li>
            <li>To respond to enquiries you send us;</li>
            <li>To analyse catalogue usage and product interest (with consent);</li>
            <li>To comply with legal obligations and protect our rights.</li>
          </ul>
        </section>

        {/* ─────────────────── Retention / Transfers ─────────────── */}
        <section className="policy-section">
          <h2>Retention of Data</h2>
          <p>
            We keep analytics data only as long as necessary for statistical purposes, generally following GA4’s standard
            retention (currently up to 14 months for event data), unless a longer period is legally required.
          </p>
        </section>

        <section className="policy-section">
          <h2>International Data Transfers</h2>
          <p>
            GA4 may process some data on Google servers outside the EU/EEA. Such transfers are protected by the European
            Commission’s <strong>Standard Contractual Clauses (SCCs)</strong> and Google’s additional safeguards. We
            configure GA4 to use EU data-region processing where available.
          </p>
        </section>

        {/* ─────────────────── Rights ───────────────────────────── */}
        <section className="policy-section">
          <h2>Your Rights under GDPR (EU/EEA &amp; UK)</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Request <strong>access</strong> to your personal data;</li>
            <li>Request <strong>rectification</strong> of inaccurate data;</li>
            <li>Request <strong>erasure</strong> (“right to be forgotten”);</li>
            <li>Request <strong>restriction</strong> or <strong>object</strong> to certain processing;</li>
            <li>Request <strong>data portability</strong> where applicable;</li>
            <li>Withdraw your <strong>consent</strong> for analytics/geolocation at any time;</li>
            <li>
              Lodge a complaint with your supervisory authority – in the Czech Republic this is{" "}
              <a className="link" href="https://www.uoou.cz/" target="_blank" rel="noopener noreferrer">
                Úřad pro ochranu osobních údajů (ÚOOÚ)
              </a>
              ; in the UK: the{" "}
              <a className="link" href="https://ico.org.uk/" target="_blank" rel="noopener noreferrer">
                Information Commissioner’s Office (ICO)
              </a>
              .
            </li>
          </ul>
        </section>

        {/* ─────────────── US State Privacy Notice ──────────────── */}
        <section className="policy-section">
          <h2>US State Privacy Notice (e.g., California/CPRA)</h2>
          <p>
            If you are a resident of a US state with privacy laws (e.g., California, Colorado, Connecticut, Virginia,
            Utah), you may have rights to know, access, correct, delete, or limit use of your personal information.
          </p>
          <ul>
            <li>
              <strong>Categories collected:</strong> identifiers (e.g., IP address), internet activity (pages viewed,
              search terms), approximate geolocation (only if you consent). We do not intentionally collect sensitive
              personal information via the catalogue.
            </li>
            <li>
              <strong>Sale/Sharing:</strong> We do <strong>not</strong> “sell” or “share” personal information as defined
              by the CPRA, and we do not use targeted advertising on the catalogue.
            </li>
            <li>
              <strong>Opt-out signals (GPC):</strong> Where our site detects the{" "}
              <a className="link" href="https://globalprivacycontrol.org/" target="_blank" rel="noopener noreferrer">
                Global Privacy Control (GPC)
              </a>{" "}
              signal, we treat it as a request to opt-out of non-essential tracking to the extent technically feasible.
              You can also use “Manage cookies &amp; consent”.
            </li>
            <li>
              <strong>How to exercise your rights:</strong> contact us at{" "}
              <a className="link" href="mailto:goldfren@goldfren.cz">
                goldfren@goldfren.cz
              </a>
              .
            </li>
          </ul>
        </section>

        {/* ─────────────────── Disclosure / Security ────────────── */}
        <section className="policy-section">
          <h2>Disclosure of Data</h2>
          <ul>
            <li>To <strong>Service Providers</strong> (e.g., Google for analytics);</li>
            <li>When required to comply with <strong>legal obligations</strong> or valid government requests;</li>
            <li>To protect our <strong>rights, security and property</strong> or that of others;</li>
            <li>As part of a <strong>business transfer</strong> (merger, acquisition, etc.) with prior notice;</li>
            <li>With your <strong>consent</strong> for any other specific purpose.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Security of Data</h2>
          <p>
            We implement reasonable technical and organisational measures to protect your data, but no method of
            transmission or storage is 100% secure. We therefore cannot guarantee absolute security.
          </p>
        </section>

        {/* ─────────────────── Children / Links / Changes ───────── */}
        <section className="policy-section">
          <h2>Children’s Privacy</h2>
          <p>
            Our catalogue is not directed to children under 13 years of age and we do not knowingly collect personal data
            from them. If you believe a child has provided us with personal data, please contact us so we can delete it
            promptly.
          </p>
        </section>

        <section className="policy-section">
          <h2>Links to Other Websites</h2>
          <p>
            Our catalogue may contain links to external websites that we do not operate. We are not responsible for the
            content or privacy practices of such sites and recommend reviewing their privacy policies.
          </p>
        </section>

        <section className="policy-section">
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Policy from time to time. The updated version will be published on this page with a new
            “Last updated” date. Significant changes will be announced on the site.
          </p>
        </section>

        {/* ─────────────────── Contact ─────────────────────────── */}
        <section className="policy-section">
          <h2>Contact Us</h2>
          <ul>
            <li>
              Email:{" "}
              <a className="link" href="mailto:goldfren@goldfren.cz">
                goldfren@goldfren.cz
              </a>
            </li>
            <li>
              Postal address: GOLDfren, Poběžovice u Holic 130, 534 01 Poběžovice u Holic, Czechia
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default CookiesPolicy;
