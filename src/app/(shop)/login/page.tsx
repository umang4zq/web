import Link from "next/link";

export const metadata = {
  title: "Login - THE HOUSE OF WEAR",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; success?: string }>;
}) {
  const resolvedParams = await searchParams;
  const nextUrl = resolvedParams.next || "/";

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <h1 className="page-title">Login</h1>
          </div>
        </div>
      </section>

      <section className="auth-section section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="auth-card">
                <div className="auth-header">
                  <h2>Welcome Back</h2>
                  <p>Please sign in to your account</p>
                </div>

                {resolvedParams.error && (
                  <div className="alert alert-danger">{resolvedParams.error}</div>
                )}
                
                {resolvedParams.success && (
                  <div className="alert alert-success">{resolvedParams.success}</div>
                )}

                <form action="/api/auth/login" method="POST" className="auth-form">
                  <input type="hidden" name="next" value={nextUrl} />
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

                  <div className="form-group mb-4">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      required
                      placeholder="Enter your password"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary-luxury w-100 mb-3">
                    Sign In
                  </button>

                  <div className="auth-footer text-center">
                    <p>
                      Don't have an account?{" "}
                      <Link href="/register" className="auth-link">
                        Create one here
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
