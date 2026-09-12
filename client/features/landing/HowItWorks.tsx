"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DoorOpen, Link2, ListMusic, Vote } from "lucide-react";
import { Container } from "@/components/layout/Container";

const steps = [
  {
    step: "01",
    title: "Create a Space",
    description: "Name the room and set a password your crew will use.",
    icon: DoorOpen,
  },
  {
    step: "02",
    title: "Invite friends",
    description: "Share the join code so everyone can hop in.",
    icon: Link2,
  },
  {
    step: "03",
    title: "Add & vote",
    description: "Paste YouTube links and upvote the tracks you want next.",
    icon: Vote,
  },
  {
    step: "04",
    title: "Let it play",
    description:
      "Top-ranked track plays on the host's device. The room stays in sync.",
    icon: ListMusic,
  },
];

export function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 border-t border-border/60 py-20 sm:py-24"
    >
      <Container>
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <p className="mt-3 text-muted-foreground">
            Four steps from silence to a shared playlist.
          </p>
        </motion.div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map(({ step, title, description, icon: Icon }, index) => (
            <motion.li
              key={step}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.5,
                delay: reduceMotion ? 0 : index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group list-none"
            >
              <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-[0_12px_28px_-20px_color-mix(in_srgb,#1c6056_35%,transparent)] transition-transform duration-300 ease-out hover:-translate-y-1 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-vybe-muted text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="font-heading text-sm font-medium tabular-nums tracking-wide text-primary/70">
                    {step}
                  </span>
                </div>

                <h3 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>

                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary/80 transition-transform duration-300 ease-out group-hover:scale-x-100"
                  aria-hidden
                />
              </article>
            </motion.li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
