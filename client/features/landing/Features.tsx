import { ListMusic, Users, Vote } from "lucide-react";
import { Container } from "@/components/layout/Container";

const features = [
  {
    icon: Users,
    title: "Built for the room",
    description:
      "Parties, hangouts, dorm nights — everyone gets a say instead of one person hogging the aux.",
  },
  {
    icon: Vote,
    title: "Votes decide the order",
    description:
      "Paste a YouTube link, upvote what you want next. The top-ranked track moves up the queue.",
  },
  {
    icon: ListMusic,
    title: "One shared stage",
    description:
      "The host plays audio. The whole Space sees what's on and what's coming — no guessing.",
  },
];

export function Features() {
  return (
    <section className="border-t border-border/60 py-20 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            What Vybe is
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty leading-relaxed">
            A collaborative music room. Open a Space, share the join code, and
            build one live queue in real time. Host plays. Everyone else adds
            and votes.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3 sm:gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="relative">
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-vybe-muted text-primary">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="font-heading text-base font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
