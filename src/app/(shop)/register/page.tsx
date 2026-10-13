import Link from "next/link";

export const metadata = {
  title: "Register - THE HOUSE OF WEAR",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedParams = await searchParams;

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <h1 className="page-title">Register</h1>
          </div>
        </div>
      </section>

      <section className="auth-section section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="auth-card">
                <div className="auth-header">
                  <h2>Create Account</h2>
                  <p>Join The House of Wear today</p>
                </div>

                {resolvedParams.error && (
                  <div className="alert alert-danger">{resolvedParams.error}</div>
                )}

                <form action="/api/auth/register" method="POST" className="auth-form">
                  <div className="form-group mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      required
                      placeholder="Create a password"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="confirm_password" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirm_password"
                      name="confirm_password"
                      required
                      placeholder="Confirm your password"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary-luxury w-100 mb-3">
                    Register
                  </button>

                  <div className="auth-footer text-center">
                    <p>
                      Already have an account?{" "}
                      <Link href="/login" className="auth-link">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
