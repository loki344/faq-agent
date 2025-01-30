<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)


```json\n[\n  {\n    \"question\": \"What is Krav Maga?\",\n    \"answer\": \"Krav Maga is an Israeli self-defense system developed for the Israel Defense Forces (IDF), which uses techniques from aikido, boxing, judo, karate, and wrestling. It focuses on real-world situations and emphasizes aggression and simultaneous defensive and offensive maneuvers.\"\n  },\n  {\n    \"question\": \"Who developed Krav Maga and what was their background?\",\n    \"answer\": \"Krav Maga was originally developed by Imi Lichtenfeld, a Hungarian-born Israeli martial artist. He grew up in Bratislava and used his training in boxing and wrestling to defend Jewish neighborhoods during anti-Semitic unrest in the 1930s. He later immigrated to Mandatory Palestine and provided combat training to Jewish paramilitary groups, eventually forming the Krav Maga system.\"\n  },\n  {\n    \"question\": \"What are the basic principles of Krav Maga?\",\n    \"answer\": \"Krav Maga encourages students to avoid physical confrontation. If unavoidable, it promotes finishing a fight quickly and aggressively. Attacks target vulnerable parts of the body, and the system includes training for situational awareness, understanding street confrontation psychology, and controlling impulses to avoid unnecessary aggression.\"\n  },\n  {\n    \"question\": \"How is Krav Maga used by the Israel Defense Forces (IDF)?\",\n    \"answer\": \"Krav Maga is used by Israeli special forces and regular infantry units. It includes variations developed for Israeli law enforcement and intelligence organizations. The IDF offers a five-week Krav Maga instructor course and has held an annual Krav Maga competition since May 2013.\"\n  },\n  {\n    \"question\": \"What is the grading system in Krav Maga?\",\n    \"answer\": \"Most Krav Maga organizations in Israel use a colored belt grading system based on the Judo ranking system, starting with a white belt and progressing through yellow, orange, green, blue, brown, and black belts, with black belts advancing from 1st to 9th Dan. Eyal Yanilov developed a patch system in the 1980s, dividing grades into Practitioner, Graduate, and Expert categories, each with five ranks.\"\n  },\n  {\n    \"question\": \"How has Krav Maga evolved since its inception?\",\n    \"answer\": \"Krav Maga has continued to evolve by incorporating techniques from other martial arts like Brazilian jiu-jitsu, Arnis/Kali/Escrima, and Silat. This openness to incorporating effective techniques from other systems reflects Krav Maga's philosophy as an ever-evolving style.\"\n  },\n  {\n    \"question\": \"What are some key focuses of Krav Maga techniques?\",\n    \"answer\": \"Key focuses include effectiveness, instinctive response under stress, and learning techniques from multiple martial arts. Training covers situational awareness, threat identification, and mental toughness to avoid rash actions.\"\n  },\n  {\n    \"question\": \"What are the two forms of Krav Maga?\",\n    \"answer\": \"One form of Krav Maga is adapted for Israeli security forces, while the other is adapted for civilian use.\"\n  }\n]\n```