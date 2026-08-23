import { Link } from "react-router";
import "./AuthPage.css";

type AuthPageProps = {
  mode: "login" | "register";
};

type Field = {
  autoComplete: string;
  id: string;
  label: string;
  placeholder?: string;
  type: "email" | "password" | "text";
};

const pageCopy = {
  login: {
    description: "Login to your Socially account",
    fields: [
      {
        autoComplete: "email",
        id: "email",
        label: "Email",
        placeholder: "m@example.com",
        type: "email",
      },
      {
        autoComplete: "current-password",
        id: "password",
        label: "Password",
        type: "password",
      },
    ] satisfies Field[],
    prompt: "Don't have an account?",
    submitLabel: "Login",
    switchLabel: "Sign up",
    switchTo: "/sign-up",
    title: "Welcome back",
  },
  register: {
    description: "Enter your email below to create your account",
    fields: [
      {
        autoComplete: "name",
        id: "name",
        label: "Name",
        placeholder: "Enter your name",
        type: "text",
      },
      {
        autoComplete: "email",
        id: "email",
        label: "Email",
        placeholder: "m@example.com",
        type: "email",
      },
      {
        autoComplete: "new-password",
        id: "password",
        label: "Password",
        type: "password",
      },
    ] satisfies Field[],
    prompt: "Already have an account?",
    submitLabel: "Create Account",
    switchLabel: "Sign in",
    switchTo: "/sign-in",
    title: "Create your account",
  },
} as const;

const AuthPage = ({ mode }: AuthPageProps) => {
  const copy = pageCopy[mode];

  return (
    <main className="auth-page">
      <div className="auth-page__content">
        <section className="auth-card" aria-labelledby={`${mode}-title`}>
          <div className="auth-card__form-panel">
            <header className="auth-card__header">
              <h1 id={`${mode}-title`}>{copy.title}</h1>
              <p>{copy.description}</p>
            </header>

            <form
              className="auth-form"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="auth-form__fields">
                {copy.fields.map((field) => (
                  <div className="auth-field" key={field.id}>
                    <label htmlFor={`${mode}-${field.id}`}>{field.label}</label>
                    <input
                      autoComplete={field.autoComplete}
                      id={`${mode}-${field.id}`}
                      name={field.id}
                      placeholder={field.placeholder}
                      required
                      type={field.type}
                    />
                  </div>
                ))}
              </div>

              <button className="auth-form__submit" type="submit">
                {copy.submitLabel}
              </button>
            </form>

            <p className="auth-card__switch">
              {copy.prompt} <Link to={copy.switchTo}>{copy.switchLabel}</Link>
            </p>
          </div>

          <div aria-hidden="true" className="auth-card__visual" />
        </section>

        <p className="auth-page__terms">
          By clicking continue, you agree to our <a href="#terms">Terms of Service</a>{" "}
          and <a href="#privacy">Privacy Policy</a>.
        </p>
      </div>
    </main>
  );
};

export default AuthPage;
