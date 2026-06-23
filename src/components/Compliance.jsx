import './Compliance.css';

export default function Compliance({ policyType = 'terms' }) {
  
  const renderContent = () => {
    switch (policyType) {
      case 'terms':
        return (
          <article className="policy-content">
            <span className="policy-subtitle-bn">ব্যবহারের শর্তাবলী</span>
            <h1>Terms & Conditions</h1>
            <p className="text-muted">Last Updated: June 23, 2026</p>
            
            <section className="policy-section">
              <h3>1. Agreement to Terms</h3>
              <p>
                Welcome to Banglar Swad (accessible via banglarswad.in). These Terms & Conditions govern your use of our website and purchase of our handcrafted spice products. By accessing this website, you agree to comply with these terms.
              </p>
            </section>

            <section className="policy-section">
              <h3>2. Intellectual Property</h3>
              <p>
                All material, recipes, stories, narratives, photography, graphics, and logos on this website are owned by Banglar Swad Spices Private Limited. You may not copy, republish, or utilize our brand narrative or materials without explicit authorization.
              </p>
            </section>

            <section className="policy-section">
              <h3>3. Products & Pricing</h3>
              <p>
                All prices are listed in Indian Rupees (INR) and include GST unless specified otherwise. We reserve the right to modify prices or discontinue spice blends at any time without notice. We make every effort to display the weight and package colors of our pouches accurately.
              </p>
            </section>

            <section className="policy-section">
              <h3>4. Payment Terms</h3>
              <p>
                We support online payments via UPI, Credit/Debit cards, Netbanking, Netbanking Wallets, and Cash on Delivery. Payments are processed securely. Your card or payment details are never stored on our servers.
              </p>
            </section>
          </article>
        );

      case 'privacy':
        return (
          <article className="policy-content">
            <span className="policy-subtitle-bn">গোপনীয়তা নীতি</span>
            <h1>Privacy Policy</h1>
            <p className="text-muted">Last Updated: June 23, 2026</p>

            <section className="policy-section">
              <h3>1. Information Collection</h3>
              <p>
                We collect personal information when you place an order, create an account, or contact us. This includes your name, shipping address, billing address, phone number, and email address.
              </p>
            </section>

            <section className="policy-section">
              <h3>2. How We Use Your Data</h3>
              <p>
                Your data is exclusively used to process shipping, fulfill orders, send shipment notifications, verify payment transactions, and answer customer support tickets. We do not sell or lease your customer profile to third-party advertising companies.
              </p>
            </section>

            <section className="policy-section">
              <h3>3. Cookies</h3>
              <p>
                We use functional cookies to remember items added to your shopping cart, manage active login sessions, and track anonymous traffic statistics to optimize website rendering.
              </p>
            </section>

            <section className="policy-section">
              <h3>4. Security</h3>
              <p>
                We implement industry-standard security protocols to protect your personal details. However, no database transmission over the internet can be guaranteed 100% secure.
              </p>
            </section>
          </article>
        );

      case 'refunds':
        return (
          <article className="policy-content">
            <span className="policy-subtitle-bn">ফেরত এবং বাতিলকরণ</span>
            <h1>Refund & Cancellation Policy</h1>
            <p className="text-muted">Last Updated: June 23, 2026</p>

            <section className="policy-section">
              <h3>1. Cancellations</h3>
              <p>
                You may request order cancellations within 6 hours of purchase or before dispatch (whichever is earlier). Once orders are handed over to shipping partners, they cannot be cancelled.
              </p>
            </section>

            <section className="policy-section">
              <h3>2. Perishable Products Policy</h3>
              <p>
                Since spice packages are food products, they are considered perishable and cannot be returned for a change of mind.
              </p>
            </section>

            <section className="policy-section">
              <h3>3. Damaged or Defective Spices</h3>
              <p>
                If your pouch arrives damaged, tampered with, or if an item is missing, please email hello@banglarswad.in within 48 hours of receipt with unboxing photos. We will dispatch a free replacement pack or initiate a full refund.
              </p>
            </section>

            <section className="policy-section">
              <h3>4. Refund Process</h3>
              <p>
                Approved refunds are processed back to the original source payment method (UPI account or Debit/Credit Card used at checkout) within <strong>5-7 business days</strong>.
              </p>
            </section>
          </article>
        );

      case 'shipping':
        return (
          <article className="policy-content">
            <span className="policy-subtitle-bn">শিপিং তথ্য</span>
            <h1>Shipping & Delivery Policy</h1>
            <p className="text-muted">Last Updated: June 23, 2026</p>

            <section className="policy-section">
              <h3>1. Processing Timelines</h3>
              <p>
                All spice orders are freshly hand-ground and packed. We dispatch orders within <strong>24-48 business hours</strong> of payment confirmation.
              </p>
            </section>

            <section className="policy-section">
              <h3>2. Delivery Timelines</h3>
              <p>
                We ship across India. Delivery times vary by location:
                <ul>
                  <li>Metros: 3-5 business days</li>
                  <li>Tier 2 cities: 4-7 business days</li>
                  <li>Rest of India: 5-8 business days</li>
                </ul>
              </p>
            </section>

            <section className="policy-section">
              <h3>3. Shipping Rates</h3>
              <p>
                We offer free shipping on all orders above ₹599. Orders below ₹599 incur a flat shipping charge of ₹49.
              </p>
            </section>

            <section className="policy-section">
              <h3>4. Tracking</h3>
              <p>
                Once handed over to our courier partners (Delhivery, BlueDart, or IndiaPost), you will receive a tracking link via email/SMS.
              </p>
            </section>
          </article>
        );

      case 'contact':
        return (
          <article className="policy-content">
            <span className="policy-subtitle-bn">যোগাযোগ</span>
            <h1>Contact Us</h1>
            <p className="text-muted">Feel free to reach out to our kitchen for any inquiries.</p>

            <div className="contact-card">
              <div className="contact-card__row">
                <strong>Legal Entity Name:</strong>
                <span>Banglar Swad Spices Private Limited</span>
              </div>
              <div className="contact-card__row">
                <strong>Registered Office Address:</strong>
                <span>12B, Lake Road, Ballygunge, Kolkata, West Bengal - 700029</span>
              </div>
              <div className="contact-card__row">
                <strong>Operational Address:</strong>
                <span>Flat 402, Green Glen Layout, Bellandur, Bangalore, Karnataka - 560103</span>
              </div>
              <div className="contact-card__row">
                <strong>Support Email ID:</strong>
                <span>hello@banglarswad.in</span>
              </div>
              <div className="contact-card__row">
                <strong>Support Contact Number:</strong>
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-card__row">
                <strong>Grievance Officer:</strong>
                <span>Rina Chatterjee</span>
              </div>
            </div>
          </article>
        );

      default:
        return <p>Page not found.</p>;
    }
  };

  return (
    <div className="policy fadeIn">
      <div className="policy__container">
        {renderContent()}
      </div>
    </div>
  );
}
