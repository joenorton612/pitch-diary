"use client";

import { useActionState, useMemo, useState } from "react";
import { addMatchAction, type ActionState } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { POSITIONS } from "@/lib/positions";
import { ScoreEntry, type Contribution } from "./ScoreEntry";

const initialState: ActionState = {};
const COMPETITIONS = ["League", "Cup", "Friendly"];
const CARDS = [
  { value: "None", label: "No Card" },
  { value: "Yellow", label: "Yellow Card 🟨" },
  { value: "Red", label: "Red Card 🟥" },
] as const;

export function AddMatchForm({ userTeam }: { userTeam: string }) {
  const [state, formAction] = useActionState(addMatchAction, initialState);
  const [open, setOpen] = useState(false);
  const [positions, setPositions] = useState<string[]>([]);
  const [venue, setVenue] = useState<"Home" | "Away">("Home");
  const [mom, setMom] = useState(false);
  const [cleanSheet, setCleanSheet] = useState(false);
  const [card, setCard] = useState<"None" | "Yellow" | "Red">("None");
  const [minutesPlayed, setMinutesPlayed] = useState("90");
  const [gameLength, setGameLength] = useState("90");

  const [opponent, setOpponent] = useState("");
  const [teamScore, setTeamScore] = useState("0");
  const [opponentScore, setOpponentScore] = useState("0");
  const [contributions, setContributions] = useState<Contribution[]>([]);

  const percentPlayed = useMemo(() => {
    const mins = Number(minutesPlayed);
    const length = Number(gameLength);
    if (!length || Number.isNaN(mins) || Number.isNaN(length)) return null;
    return Math.round((mins / length) * 100);
  }, [minutesPlayed, gameLength]);

  const goals = contributions.filter((c) => c === "goal").length;
  const assists = contributions.filter((c) => c === "assist").length;

  function handleTeamScoreChange(value: string) {
    setTeamScore(value);
    const max = Number(value) || 0;
    setContributions((prev) => (prev.length > max ? prev.slice(0, max) : prev));
  }

  function addContribution(type: Contribution) {
    setContributions((prev) => {
      const max = Number(teamScore) || 0;
      if (prev.length >= max) return prev;
      return [...prev, type];
    });
  }

  function removeContribution(index: number) {
    setContributions((prev) => prev.filter((_, i) => i !== index));
  }

  function togglePosition(p: string) {
    setPositions((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-cream-300 bg-cream-100 py-4 text-sm font-semibold text-ink/60 transition hover:border-gold-500 hover:text-ink"
      >
        + Log a Match
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-2xl border border-cream-300 bg-cream-100 p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-ink">Log a Match</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm font-semibold text-ink/50 hover:text-ink"
        >
          Cancel
        </button>
      </div>

      <div>
        <p className="text-sm font-medium text-ink/80">Home or Away</p>
        <div className="mt-1.5 inline-flex gap-1 rounded-xl border border-cream-300 bg-field p-1">
          {(["Home", "Away"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVenue(v)}
              className={`rounded-lg px-5 py-1.5 text-sm font-semibold transition ${
                venue === v ? "bg-pitch-900 text-white" : "text-ink/60 hover:text-ink"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <input type="hidden" name="venue" value={venue} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date" htmlFor="playedOn">
          <input
            id="playedOn"
            name="playedOn"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
            className={inputClass}
          />
        </Field>
        <Field label="Competition" htmlFor="competition">
          <select
            id="competition"
            name="competition"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Choose a competition
            </option>
            {COMPETITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <ScoreEntry
        venue={venue}
        userTeam={userTeam}
        opponent={opponent}
        onOpponentChange={setOpponent}
        teamScore={teamScore}
        onTeamScoreChange={handleTeamScoreChange}
        opponentScore={opponentScore}
        onOpponentScoreChange={setOpponentScore}
        contributions={contributions}
        onAdd={addContribution}
        onRemove={removeContribution}
      />
      <input type="hidden" name="opponent" value={opponent} />
      <input type="hidden" name="teamScore" value={teamScore} />
      <input type="hidden" name="opponentScore" value={opponentScore} />
      <input type="hidden" name="goals" value={goals} />
      <input type="hidden" name="assists" value={assists} />

      <Field label="Rating (0–10)" htmlFor="rating">
        <input
          id="rating"
          name="rating"
          type="number"
          step="0.1"
          min={0}
          max={10}
          required
          placeholder="e.g. 7.5"
          className={inputClass}
        />
      </Field>

      <div>
        <p className="text-sm font-medium text-ink/80">
          Position(s) Played <span className="text-ink/40">(select at least one)</span>
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {POSITIONS.map((p) => {
            const selected = positions.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePosition(p)}
                aria-pressed={selected}
                className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
                  selected
                    ? "border-gold-500 bg-gold-500 text-pitch-950"
                    : "border-cream-300 bg-field text-ink/60 hover:text-ink"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
        {positions.map((p) => (
          <input key={p} type="hidden" name="positionsPlayed" value={p} />
        ))}
      </div>

      <div>
        <p className="text-sm font-medium text-ink/80">Man of the Match</p>
        <div className="mt-1.5 inline-flex gap-1 rounded-xl border border-cream-300 bg-field p-1">
          {[
            { v: false, label: "No" },
            { v: true, label: "Yes" },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setMom(opt.v)}
              className={`rounded-lg px-5 py-1.5 text-sm font-semibold transition ${
                mom === opt.v ? "bg-pitch-900 text-white" : "text-ink/60 hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="manOfMatch" value={mom ? "true" : "false"} />
      </div>

      <div>
        <p className="text-sm font-medium text-ink/80">Clean Sheet</p>
        <div className="mt-1.5 inline-flex gap-1 rounded-xl border border-cream-300 bg-field p-1">
          {[
            { v: false, label: "No" },
            { v: true, label: "Yes" },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setCleanSheet(opt.v)}
              className={`rounded-lg px-5 py-1.5 text-sm font-semibold transition ${
                cleanSheet === opt.v ? "bg-pitch-900 text-white" : "text-ink/60 hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="cleanSheet" value={cleanSheet ? "true" : "false"} />
      </div>

      <div>
        <p className="text-sm font-medium text-ink/80">Card</p>
        <div className="mt-1.5 flex flex-wrap gap-1 rounded-xl border border-cream-300 bg-field p-1">
          {CARDS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCard(c.value)}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
                card === c.value ? "bg-pitch-900 text-white" : "text-ink/60 hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="card" value={card} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Minutes Played" htmlFor="minutesPlayed">
          <input
            id="minutesPlayed"
            name="minutesPlayed"
            type="number"
            min={0}
            required
            value={minutesPlayed}
            onChange={(e) => setMinutesPlayed(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Game Length (mins)" htmlFor="gameLengthMinutes">
          <input
            id="gameLengthMinutes"
            name="gameLengthMinutes"
            type="number"
            min={1}
            required
            value={gameLength}
            onChange={(e) => setGameLength(e.target.value)}
            className={inputClass}
          />
        </Field>
        <div>
          <p className="block text-sm font-medium text-ink/80">% of Match Played</p>
          <div className="mt-1.5 flex h-[42px] items-center rounded-xl border border-cream-300 bg-cream-200 px-4 text-sm font-semibold text-ink">
            {percentPlayed === null ? "—" : `${percentPlayed}%`}
          </div>
        </div>
      </div>

      <Field label="Notes (optional)" htmlFor="notes">
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Anything memorable about the match?"
          className={inputClass}
        />
      </Field>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <SubmitButton pendingText="Saving…">Save Match</SubmitButton>
    </form>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-cream-300 bg-field px-4 py-2.5 text-sm text-ink outline-none ring-gold-500/30 focus:border-gold-500 focus:ring-4";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink/80">
        {label}
      </label>
      {children}
    </div>
  );
}
