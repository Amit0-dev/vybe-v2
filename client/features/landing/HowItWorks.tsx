import { Container } from "@/components/layout/Container";

const steps = [
  {
    step: "1",
    title: "Create a Space",
    description: "Name the room and set a password your crew will use.",
  },
  {
    step: "2",
    title: "Invite friends",
    description: "Share the join code so everyone can hop in.",
  },
  {
    step: "3",
    title: "Add & vote",
    description: "Paste YouTube links and upvote the tracks you want next.",
  },
  {
    step: "4",
    title: "Let it play",
    description:
      "Top-ranked track plays on the host's device. The room stays in sync.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 border-t border-border/60 py-20 sm:py-24"
    >
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <p className="mt-3 text-muted-foreground">
            Four steps from silence to a shared playlist.
          </p>
        </div>

        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map(({ step, title, description }) => (
            <li key={step}>
              <span className="font-heading text-3xl font-semibold tabular-nums text-primary/90">
                {step}
              </span>
              <h3 className="mt-3 font-heading text-base font-medium">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
