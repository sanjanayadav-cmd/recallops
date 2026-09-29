import { useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [incident, setIncident] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [memories, setMemories] = useState([]);
  const [memoryCount, setMemoryCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [rootCause, setRootCause] = useState("");
  const [resolution, setResolution] = useState("");
  const [outcome, setOutcome] = useState("");

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const analyzeIncident = async () => {
    if (!incident.trim()) {
      setError("Please describe the production incident first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis("");
    setMemories([]);
    setMemoryCount(0);
    setSaved(false);

    try {
      const response = await fetch(
        `${API_URL}/api/incidents/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            incident,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to analyze incident."
        );
      }

      setAnalysis(data.analysis || "No analysis returned.");
      setMemories(data.memoriesUsed || []);
      setMemoryCount(data.memoryCount || 0);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to RecallOps backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const resolveIncident = async () => {
    if (
      !incident.trim() ||
      !rootCause.trim() ||
      !resolution.trim()
    ) {
      setError(
        "Incident, root cause, and resolution are required."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const response = await fetch(
        `${API_URL}/api/incidents/resolve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            incident,
            rootCause,
            resolution,
            outcome,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save incident."
        );
      }

      setSaved(true);
    } catch (err) {
      setError(
        err.message ||
          "Failed to save incident to Hindsight."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">R</div>

          <div>
            <div className="brand-name">RecallOps</div>
            <div className="brand-subtitle">
              AI Incident Intelligence
            </div>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="eyebrow">
            Incident Response Intelligence
          </div>

          <h1>
            Resolve incidents with
            <br />
            memory, not guesswork.
          </h1>

          <p>
            RecallOps analyzes production incidents using AI
            and retrieves relevant historical incidents from
            persistent Hindsight memory.
          </p>
        </section>

        <section className="input-card">
          <div className="card-label">
            <strong>Production Incident</strong>
            <span>Describe what is happening</span>
          </div>

          <textarea
            className="incident-input"
            value={incident}
            onChange={(e) => setIncident(e.target.value)}
            placeholder="Example: After a deployment, our production API is experiencing intermittent database timeouts and some requests are failing..."
          />

          <div className="actions">
            <button
              className="analyze-button"
              onClick={analyzeIncident}
              disabled={loading}
            >
              {loading
                ? "Analyzing..."
                : "Analyze Incident →"}
            </button>
          </div>

          {error && <div className="error">{error}</div>}
        </section>

        {analysis && (
          <section className="input-card resolution-card">
            <div className="card-label">
              <strong>Resolve & Remember</strong>
              <span>Teach RecallOps what happened</span>
            </div>

            <textarea
              className="incident-input"
              value={rootCause}
              onChange={(e) =>
                setRootCause(e.target.value)
              }
              placeholder="What was the root cause?"
            />

            <textarea
              className="incident-input"
              value={resolution}
              onChange={(e) =>
                setResolution(e.target.value)
              }
              placeholder="What fixed the incident?"
            />

            <textarea
              className="incident-input"
              value={outcome}
              onChange={(e) =>
                setOutcome(e.target.value)
              }
              placeholder="What was the outcome?"
            />

            <div className="actions">
              <button
                className="analyze-button"
                onClick={resolveIncident}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save to Hindsight →"}
              </button>
            </div>

            {saved && (
              <div className="success-message">
                ✓ Incident resolution stored in Hindsight
                memory.
              </div>
            )}
          </section>
        )}

        <section className="results">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="panel-icon">✦</div>
                AI Analysis
              </div>
            </div>

            <div className="panel-body">
              {analysis ? (
                <div className="analysis">
                  {analysis}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">✦</div>

                  Submit an incident to generate an AI
                  investigation
                  <br />

                  based on current and historical context.
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="panel-icon">🧠</div>
                Hindsight Memory
              </div>

              {memoryCount > 0 && (
                <span className="memory-count">
                  {memoryCount} memories
                </span>
              )}
            </div>

            <div className="panel-body">
              {memories.length > 0 ? (
                memories
                  .slice(0, 5)
                  .map((memory, index) => (
                    <div
                      className="memory-item"
                      key={index}
                    >
                      <div className="memory-type">
                        {memory.type || "memory"}
                      </div>

                      <div className="memory-text">
                        {memory.text}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🧠</div>

                  Historical incident memories used by
                  the AI will appear here.
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="footer">
          Powered by <strong>RecallOps</strong> · Persistent
          incident intelligence with Hindsight
        </div>
      </main>
    </div>
  );
}

export default App;