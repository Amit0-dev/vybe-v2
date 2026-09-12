"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Library, ListMusic, Users, Vote } from "lucide-react";
import { Container } from "@/components/layout/Container";

const features = [
  {
    icon: Users,
    title: "Built for the room",
    description: "Everyone gets a say — not just whoever has the aux.",
  },
  {
    icon: Vote,
    title: "Votes decide the order",
    description: "Upvote what you want. The top track plays next.",
  },
  {
    icon: Library,
    title: "Custom music library",
    description: "Queue songs from your own storage, not only YouTube.",
  },
  {
    icon: ListMusic,
    title: "One shared stage",
    description: "Host plays. Everyone sees what's on and what's next.",
  },
];

export function Features() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-t border-border/60 py-20 sm:py-24">
      <Container>
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            What Vybe is
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty leading-relaxed">
            A collaborative music room. Share a Space, build one live queue —
            host plays, everyone else adds and votes.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {features.map(({ icon: Icon, title, description }, index) => (
            <motion.article
              key={title}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.5,
                delay: reduceMotion ? 0 : index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-[0_12px_28px_-20px_color-mix(in_srgb,#1c6056_35%,transparent)] transition-transform duration-300 ease-out hover:-translate-y-1 sm:p-6"
            >
              <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-vybe-muted text-primary">
                <Icon className="size-5" aria-hidden />
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
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
