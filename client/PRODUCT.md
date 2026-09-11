# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People hosting or joining group hangouts — parties, road trips, dorm rooms, game nights — who want everyone to shape what plays without fighting over the aux.

## Product Purpose

Vybe is a collaborative music queue. A host creates a Space; friends join with a code; everyone adds YouTube tracks and votes. The highest-ranked track plays on the host's device. Success means the room shares one live queue without a single person DJing alone.

## Positioning

Democratic music rooms with host-device playback — not a personal streaming library and not multi-device sync. The queue and votes are the product; the host's browser is the speaker.

## Capabilities

- Create and join Spaces (name + password / join code)
- Add tracks via YouTube URL
- Vote on queued tracks
- Host playback controls (play / pause / skip)
- Live space view of now playing and up-next queue

## Constraints

- UI-only phase: no API, auth, WebSocket, or real audio wiring yet
- Components accept props/callbacks for later backend connection
- Owner vs member control visibility must remain clear in the UI

## Terminology

- **Space** — a shared music room
- **Queue** — ranked list of upcoming tracks
- **Host / Owner** — Space creator who plays audio
- **Member** — participant who adds and votes

## Voice

Direct, social, energetic but not hype-bro. Short sentences. Prefer "crew" and "room" over enterprise language.

## Accessibility

WCAG AA contrast targets. Keyboard-reachable controls. Icon-only buttons require accessible names.
