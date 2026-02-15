import { useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}


const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsicHJhdGlrMjhyYXRob3JlQGdtYWlsLmNvbSJdLCJpc3MiOiJoZW5uZ2UtYWRtaXNzaW9uLWNoYWxsZW5nZSIsInN1YiI6ImNoYWxsZW5nZSJ9.F-oNqA2H448jidtD4KNyz4CFf46MKE2D_SDjKebmfkE";

const API_BASE_URL =
  "https://api.challenge.hennge.com/password-validation-challenge-api/001";

function CreateUserForm({ setUserWasCreated }: CreateUserFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ---- PASSWORD VALIDATION RULES ----
  const validations = [
    {
      message: "Password must be at least 10 characters long",
      valid: password.length >= 10,
    },
    {
      message: "Password must be at most 24 characters long",
      valid: password.length <= 24,
    },
    {
      message: "Password cannot contain spaces",
      valid: !/\s/.test(password),
    },
    {
      message: "Password must contain at least one number",
      valid: /\d/.test(password),
    },
    {
      message: "Password must contain at least one uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      message: "Password must contain at least one lowercase letter",
      valid: /[a-z]/.test(password),
    },
  ];

  const passwordInvalid = validations.some((v) => !v.valid);

  // ---- SUBMIT HANDLER ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setApiError(null);

    if (!username.trim() || passwordInvalid) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/challenge-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      if (res.ok) {
        setUserWasCreated(true);
        return;
      }

      if (res.status === 401 || res.status === 403) {
        setApiError("Not authenticated to access this resource.");
        return;
      }

      if (res.status === 400) {
        setApiError(
          "Sorry, the entered password is not allowed, please try a different one."
        );
        return;
      }

      setApiError("Something went wrong, please try again.");
    } catch {
      setApiError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={formWrapper}>
      <form style={form} onSubmit={handleSubmit}>
        <label htmlFor="username" style={formLabel}>
          Username
        </label>
        <input
          id="username"
          style={formInput}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-invalid={!username.trim()}
        />

        <label htmlFor="password" style={formLabel}>
          Password
        </label>
        <input
          id="password"
          type="password"
          style={formInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={passwordInvalid}
        />

        {/* Client-side validation messages */}
        {password.length > 0 && (
          <ul style={{ margin: "8px 0", paddingLeft: "18px" }}>
            {validations
              .filter((v) => !v.valid)
              .map((v) => (
                <li key={v.message}>{v.message}</li>
              ))}
          </ul>
        )}

        {/* API error messages */}
        {apiError && (
          <div style={{ color: "red", marginTop: "8px" }}>{apiError}</div>
        )}

        <button
          style={formButton}
          disabled={loading || !username.trim() || passwordInvalid}
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}

export { CreateUserForm };

// ---- DO NOT MODIFY STYLES ----

const formWrapper: CSSProperties = {
  maxWidth: '500px',
  width: '80%',
  backgroundColor: '#efeef5',
  padding: '24px',
  borderRadius: '8px',
};

const form: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const formLabel: CSSProperties = {
  fontWeight: 700,
};

const formInput: CSSProperties = {
  outline: 'none',
  padding: '8px 16px',
  height: '40px',
  fontSize: '14px',
  backgroundColor: '#f8f7fa',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
};

const formButton: CSSProperties = {
  outline: 'none',
  borderRadius: '4px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#7135d2',
  color: 'white',
  fontSize: '16px',
  fontWeight: 500,
  height: '40px',
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '8px',
  alignSelf: 'flex-end',
  cursor: 'pointer',
};
