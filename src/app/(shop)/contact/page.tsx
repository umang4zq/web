import Link from "next/link";
import AnimatedReveal from "@/components/AnimatedReveal";

export const metadata = {
  title: "Contact Us - THE HOUSE OF WEAR",
};

export default function ContactPage() {
  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <h1 className="page-title">Contact Us</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">Contact</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section section-padding">
        <div className="container">
          <div className="row">
            {/* Contact Info */}
            <div className="col-lg-4 mb-5 mb-lg-0">
              <AnimatedReveal delay={0.1}>
                <div className="contact-info-wrapper pe-lg-4">
                  <span className="section-subtitle">Get In Touch</span>
                  <h2 className="section-title h3 mb-4">We're Here to Help</h2>
                  <p className="contact-text mb-5">
                    Whether you have a question about an order, need styling advice,
                    or want to learn more about our brands, our concierge team is at
                    your service.
                  </p>

                  <div className="contact-info-list">
                    <div className="contact-info-item">
                      <div className="icon">
                        <i className="bi bi-geo-alt"></i>
                      </div>
                      <div className="content">
                        <h5 className="title">Visit Us</h5>
                        <p className="text">
                          123 Luxury Avenue, Fashion District
                          <br />
                          Mumbai, Maharashtra 400001
                        </p>
                      </div>
                    </div>

                    <div className="contact-info-item">
                      <div className="icon">
                        <i className="bi bi-envelope"></i>
                      </div>
                      <div className="content">
                        <h5 className="title">Email Us</h5>
                        <p className="text">
                          <a href="mailto:concierge@thehouseofwear.com">
                            concierge@thehouseofwear.com
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="contact-info-item">
                      <div className="icon">
                        <i className="bi bi-telephone"></i>
                      </div>
                      <div className="content">
                        <h5 className="title">Call Us</h5>
                        <p className="text">
                          <a href="tel:+919876543210">+91 98765 43210</a>
                          <br />
                          <small>Mon-Sat, 10am to 7pm IST</small>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedReveal>
            </div>

            {/* Contact Form */}
            <div className="col-lg-8">
              <AnimatedReveal delay={0.2}>
                <div className="contact-form-wrapper p-4 p-md-5 bg-light rounded-3 shadow-sm">
                  <h3 className="h4 mb-4">Send us a message</h3>
                {/* Note: This form submission logic will need to be connected to a Next.js API route or Server Action later */}
                <form action="/api/contact" method="POST" className="contact-form">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control luxury-input"
                          id="name"
                          name="name"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control luxury-input"
                          id="email"
                          name="email"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="subject" className="form-label">
                          Subject
                        </label>
                        <input
                          type="text"
                          className="form-control luxury-input"
                          id="subject"
                          name="subject"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="message" className="form-label">
                          Message
                        </label>
                        <textarea
                          className="form-control luxury-input"
                          id="message"
                          name="message"
                          rows={5}
                          required
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-12 mt-4">
                      <button type="submit" className="btn-primary-luxury w-100">
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </AnimatedReveal>
          </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container-fluid p-0">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995!3d19.08219785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Store Location"
          ></iframe>
        </div>
      </section>
    </>
  );
}
