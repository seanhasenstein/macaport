import Link from 'next/link';
import styled from 'styled-components';
import Layout from '../components/Layout';

export default function PrivacyPolicy() {
  return (
    <Layout title="Privacy Policy">
      <PrivacyPolicyStyles>
        <h2>Privacy Policy</h2>
        <p className="updated">Last updated July 12, 2022</p>
        <div className="section">
          <p>
            This privacy notice for Macaport LLC (“Company”, “we”, “us”, or
            “our”), describes how and why we might collect, store, use, and/or
            share (“process”) your information when you use our services
            (“Services”), such as when you:
          </p>
          <ul>
            <li>
              Visit our website at{' '}
              <Link href="/">
                <a>https://www.macaport.com</a>
              </Link>
              , or any website of ours that links to this privacy notice.
            </li>

            <li>
              Engage with us in other related ways, including sales, marketing,
              or events.
            </li>
          </ul>

          <p>
            Questions or concerns? Reading this privacy notice will help you
            understand your privacy rights and choices. If you do not agree with
            our policies and practices, please do not use our Services. If you
            still have any questions or concerns, please contact us at{' '}
            <a
              href="mailto:support@macaport.com"
              target="_blank"
              rel="noreferrer"
            >
              support@macaport.com
            </a>
            .
          </p>
        </div>
        <div className="section">
          <h3>1. What information do we collect?</h3>

          <p>Personal information you disclose to us</p>

          <p className="italic">
            <span className="bold">In Short:</span> We collect personal
            information that you provide to us.
          </p>

          <p>
            We collect personal information that you voluntarily provide to us
            when you express an interest in obtaining information about us our
            products and Services, the choices you make, and the products and
            features you use. The personal information we collect may include
            the following:
          </p>
          <ul>
            <li className="m-0">names</li>
            <li className="m-0">phone numbers</li>
            <li className="m-0">email addresses</li>
            <li className="m-0">mailing addresses</li>
            <li>
              Sensitive Information: We do not process sensitive information.
            </li>
          </ul>

          <p>
            Payment Data. We may collect data necessary to process your payment
            if you make purchases, such as payment instrument number (such as
            credit card number), and the security code associated with your
            payment instrument. All payment is stored by Stripe. You may find
            their privacy notice link(s) here:
          </p>

          <p>
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noreferrer"
            >
              https://stripe.com/privacy
            </a>
          </p>

          <p>
            All personal information that you provide to us must be true,
            complete, and accurate, and you must notify us of any changes to
            such personal information.
          </p>

          <p>Information automatically collected</p>

          <p className="italic">
            <span className="bold">In Short:</span> Some information — such as
            your Internet Protocol (IP) address and/or browser and device
            characteristics — is stored automatically when you visit our
            Services.
          </p>

          <p>
            We automatically collect certain information when you visit, use, or
            navigate the Services. This information does not reveal your
            specific identity (like your name and contact information) but may
            include device and usage information, such as your IP address,
            browser and device characteristics, operating system, language
            preferences, referring URLs, device name, country, location,
            information about the and when you use our Services, and other
            technical information. This information is primarily needed to
            maintain the security and operation of our Services, and for our
            internal analytics and reporting purposes.
          </p>

          <p>
            Like many businesses, we also collect information through cookies
            and similar technologies.
          </p>

          <p>The information we collect includes:</p>

          <ul>
            <li>
              <span className="italic bold">Log and Usage Data.</span> Log and
              usage data is service-related, diagnostic, usage, and performance
              information our servers automatically collect when you access or
              use our Services and which we record in log files. Depending on
              how you interact with us, this log data may include your IP
              address, device information, browser type, and settings and
              information about your activity in the Services (such as the
              date/time stamps associated with your usage, pages and files
              viewed, searches, and other actions you take such as which
              features you use), device event information (such as system
              activity, error reports (sometimes called “crash dumps”), and
              hardware settings).
            </li>

            <li>
              <span className="italic bold">Device Data.</span> We collect
              device data such as information about your computer, phone,
              tablet, or other device you use to access the Services. Depending
              on the device used, this device data may include information such
              as your IP address (or proxy server), device and application
              identification numbers, location, browser type, hardware model,
              Internet service provider and/or mobile carrier, operating system,
              and system configuration information.
            </li>

            <li>
              <span className="italic bold">Location Data.</span> We collect
              location data such as information about your device's location,
              which can be either precise or imprecise. How much information we
              collect depends on the type and settings of the device you use to
              access the Services. For example, we may use GPS and other
              technologies to collect geolocation data that tells us your
              current location (based on your IP address). You can opt out of
              allowing us to collect this information either by refusing access
              to the information or by disabling your Location setting on your
              device. However, if you choose to opt out, you may not be able to
              use certain aspects of the Services.
            </li>
          </ul>
        </div>
        <div className="section">
          <h3>2. How do we process your information?</h3>

          <p className="italic">
            <span className="bold">In Short:</span> We process your information
            to provide, improve, and administer our Services, communicate with
            you, for security and fraud prevention, and to comply with law. We
            may also process your information for other purposes with your
            consent.
          </p>

          <p>
            We process your personal information for a variety of reasons,
            depending on how you interact with our Services, including:
          </p>

          <ul>
            <li>
              To deliver and facilitate delivery of services to the user. We may
              process your information to provide you with the requested
              service.
            </li>

            <li>
              To respond to user inquiries/offer support to users. We may
              process your information to respond to your inquiries and solve
              any potential issues you might have with the requested service.
            </li>

            <li>
              To fulfill and manage your orders. We may process your information
              to fulfill and manage your orders, payments, returns, and
              exchanges made through the Services.
            </li>

            <li>
              To request feedback. We may process your information when
              necessary to request feedback and to contact you about your use of
              our Services.
            </li>

            <li>
              To evaluate and improve our Services, products, marketing, and
              your experience. We may process your information when we believe
              it is necessary to identify usage trends, determine the
              effectiveness of our promotional campaigns, and to evaluate and
              improve our Services, products, marketing and your experience.
            </li>

            <li>
              To identify usage trends. We may process your information about
              how you use our Services to better understand how they are being
              used so that we can improve them.
            </li>
          </ul>
        </div>
        <div className="section">
          <h3>3. When and with whom do we share your personal information?</h3>
          <p className="italic">
            <span className="bold">In Short:</span> We may share information in
            specific situations described in this section and/or with the
            following third parties.
          </p>

          <p>
            Vendors, Consultants, and Other Third-Party Service Providers. We
            may share your data with third party vendors, service providers,
            contractors, or agents (“third parties”) who perform services for us
            on our behalf and require access to such information to do that
            work. Third parties we may share personal information with are as
            follows:
          </p>

          <p className="bold">Invoice and Billing</p>

          <p>- Stripe</p>

          <p>
            We also may need to share your personal information in the following
            situations:
          </p>

          <ul>
            <li>
              <span className="bold">Business Transfers.</span> We may share or
              transfer your information in connection with, or during
              negotiations of, any merger, sale of company assets, financing, or
              acquisition of all or a portion of our business to another
              company.
            </li>

            <li>
              <span className="bold">Affiliates.</span> We my share your
              information with our affiliates, in which case we will require
              those affiliates to honor this privacy notice. Affiliates include
              our parent company and any subsidiaries, joint venture partners,
              or other companies that we control or that are under common
              control with us.
            </li>
          </ul>
        </div>
        <div className="section">
          <h3>4. Do we use cookies and other tracking technologies?</h3>

          <p className="italic">
            <span className="bold">In short:</span> We may use cookies and other
            tracking technologies to collect and store your information.
          </p>

          <p>
            We may use cookies and similar tracking technologies (like web
            beacons and pixels) to access or store information.
          </p>
        </div>
        <div className="section">
          <h3>5. How long do we keep your information?</h3>

          <p className="italic">
            <span className="bold">In Short:</span> We keep your information for
            as long as necessary to fulfill the purposes outlined in this
            privacy notice unless otherwise required by law.
          </p>

          <p>
            We will only keep your personal information for as long as it is
            necessary for the purposes set out in this privacy notice, unless a
            longer retention period is required or permitted by law (such as
            taxes, accounting, or other legal requirements). No purpose in this
            notice will require us keeping your personal information for longer
            than 3 years.
          </p>

          <p>
            When we have no ongoing legitimate business need to process your
            personal information, we will either delete or anonymize such
            information, or, if this is not possible (for example, because your
            personal information has been stored in backup archives), then we
            will securely store your personal information and isolate it from
            any further processing until deletion is possible.
          </p>
        </div>
        <div className="section">
          <h3>6. How do we keep your information safe?</h3>

          <p className="italic">
            <span className="bold">In Short:</span> We aim to protect your
            personal information through a system of organizational and
            technical measures.
          </p>

          <p>
            We have implemented appropriate and reasonable technical and
            organizational security measures designed to protect the security of
            any personal information we process. However, despite our safeguards
            and efforts to secure your information, no electronic transmission
            over the Internet or information storage technology can be
            guaranteed to be 100% secure, so we cannot promise or guarantee that
            hackers, cybercriminals, or other unauthorized third parties will
            not be able to defeat our security and improperly collect, access,
            steal, or modify your information. Although we will do our best to
            protect your personal information, transmission of personal
            information to and from our Services is at your own risk. You should
            only access the Services within a secure environment.
          </p>
        </div>
        <div className="section">
          <h3>7. What are your privacy rights?</h3>

          <p className="italic">
            <span className="bold">In Short:</span> You may review, change, or
            terminate your account at any time.
          </p>

          <p>
            If you are located in the EEA or UK and you believe we are
            unlawfully processing your personal information, you also have the
            right to complain to your local data protection supervisory
            authority. You can find their contact details here:{' '}
            <a
              href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm"
              target="_blank"
              rel="noreferrer"
            >
              https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm
            </a>
            .
          </p>

          <p>
            If you are located in Switzerland, the contact details for the data
            protection authorities are available here:{' '}
            <a
              href="https://www.edoeb.admin.ch/edoeb/en/home.html"
              target="_blank"
              rel="noreferrer"
            >
              https://www.edoeb.admin.ch/edoeb/en/home.html
            </a>
            .
          </p>

          <p>
            <span className="bold">Withdrawing your consent:</span> If we are
            relying on your consent to process your personal information, which
            may be express and/or implied consent depending on the applicable
            law, you have the right to withdraw your consent at any time. You
            can withdraw your consent at any time by contacting us by using the
            contact details provided in the section “How can you contact us
            about this notice?” below.
          </p>

          <p>
            However, please note that this will not affect the lawfulness of the
            processing before its withdrawal, nor when applicable law allows,
            will it affect the processing of your personal information conducted
            in reliance on lawful processing grounds other than consent.
          </p>

          <p>
            <span className="bold">Cookies and similar technologies:</span> Most
            Web browsers are set to accept cookies by default. If you prefer,
            you can usually choose to set your browser to remove cookies and to
            reject cookies. If you choose to remove cookies or reject cookies,
            this could affect certain features or services of our Services.
          </p>

          <p>
            If you have questions or comments about your privacy rights, you may
            email us at{' '}
            <a
              href="mailto:support@macaport.com"
              target="_blank"
              rel="noreferrer"
            >
              support@macaport.com
            </a>
            .
          </p>
        </div>
        <div className="section">
          <h3>8. Controls for do-not-track features</h3>

          <p>
            Most web browsers and some mobile operating systems and mobile
            applications include Do-Not-Track (“DNT”) feature or setting you can
            activate to signal your privacy preference not to have data about
            your online browsing activities monitored and collected. At this
            stage no uniform technology standard for recognizing and
            implementing DNT signals has been finalized. As such, we do not
            currently respond to DNT browser signals or any other mechanism that
            automatically communicates your choice not to be tracked online. If
            a standard for online tracking is adopted that we must follow in the
            future, we will inform you about that practice in a revised version
            of this Privacy notice.
          </p>
        </div>
        <div className="section">
          <h3>9. Do California residents have specific privacy rights?</h3>

          <p className="italic">
            <span className="bold">In Short:</span> Yes, if you are a resident
            of California, you are granted specific rights regarding access to
            your personal information.
          </p>

          <p>
            California Civil Code Section 1798.83, also known as the “Shine The
            Light” law, permits our users who are California residents to
            request and obtain from us, once a year and free of charge,
            information about categories of personal information (if any) we
            disclosed to third parties for direct marketing purposes and the
            names and addresses of all third parties with which we shared
            personal information in the immediately preceding calendar year. If
            you are a California resident and would like to make such a request,
            please submit your request in writing to us using the contact
            information provided below.
          </p>

          <p>
            If you are under 18 years of age, reside in California, and have a
            registered account with the Site, you have the right to request
            removal of unwanted data that you publicly post on the Site. To
            request removal of such data, please contact us using the contact
            information provided below, and include the email address associated
            with your account and a statement that you reside in California. We
            will make sure the data is not publicly displayed on the Site, but
            please be aware that the data may not be completely or
            comprehensively removed from our systems.
          </p>
        </div>
        <div className="section">
          <h3>10. Do we make updates to this notice?</h3>

          <p className="italic">
            <span className="bold">In Short:</span> Yes, we will update this
            notice as necessary to stay compliant with relevant laws.
          </p>

          <p>
            We may update this privacy notice from time to time. The updated
            version will be indicated by an updated “Revised” date and the
            updated version will be effective as soon as it is accessible. If we
            make material changes to this privacy notice, we may notify you
            either by prominently posting a notice of such changes or by
            directly sending you a notification. We encourage you to review this
            privacy notice frequently to be informed of how we are protecting
            your information.
          </p>
        </div>
        <div className="section">
          <h3>11. How can you contact us about this notice?</h3>

          <p>
            If you have questions or comments about this notice, you may email
            us at{' '}
            <a
              href="mailto:support@macaport.com"
              target="_blank"
              rel="noreferrer"
            >
              support@macaport.com
            </a>{' '}
            or by post to:
          </p>

          <p>
            Macaport LLC
            <br />
            E8644 Casey Rd
            <br />
            New London, WI 54961
            <br />
            United States
          </p>
        </div>
        <div className="section">
          <h3>
            12. How can you review, update or delete the data we collect from
            you?
          </h3>

          <p>
            Based on the applicable laws of your country, you may have the right
            to access the personal information we collect from you, change that
            information, or delete it. To request to review, update, or delete
            your personal information, please submit a request by contacting us
            at{' '}
            <a
              href="mailto:support@macaport.com"
              target="_blank"
              rel="noreferrer"
            >
              support@macaport.com
            </a>
            .
          </p>
        </div>
      </PrivacyPolicyStyles>
    </Layout>
  );
}

const PrivacyPolicyStyles = styled.div`
  margin: 0 auto;
  padding: 6rem 1.5rem;
  max-width: 64rem;
  width: 100%;

  .section {
    margin: 0 0 3.5rem;
  }

  h2 {
    margin: 0 0 1rem;
    font-size: 2.75rem;
    font-weight: 800;
    text-align: center;
    line-height: 1;
    letter-spacing: -0.025em;
  }

  h3 {
    margin: 0 0 1.125rem;
    font-size: 1.5rem;
    color: #111827;
  }

  .italic {
    font-style: italic;
  }

  .bold {
    font-weight: 700;
  }

  p,
  li {
    a {
      color: #1d4ed8;
      text-decoration: underline;
    }
  }

  p {
    margin: 0 0 1.75rem;
    font-size: 1rem;
    color: #4b5563;
    line-height: 1.625;

    &.updated {
      margin: 0 0 4rem;
      color: #4b5563;
      text-align: center;
    }

    &.bold {
      margin: 2.5rem 0 1rem;
      font-weight: 600;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  ul {
    padding: 0 0 0 1rem;

    li.m-0 {
      margin: 0;
    }
  }

  li {
    margin: 0 0 1.5rem;
    padding: 0 0 0 0.5rem;
    font-size: 1rem;
    color: #4b5563;
    line-height: 1.625;
  }
  @media (max-width: 500px) {
    h2 {
      font-size: 2rem;
      line-height: 1.25;
    }

    h3 {
      font-size: 1.25rem;
    }
  }
`;
