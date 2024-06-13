import Layout from "@/components/Layout";
import Nav from "@/components/Nav";
import CreateContent from "@/components/CreateContent";
import Newsletter from "@/components/Newsletter";
import React from "react";

const coc = () => {
  return (
    <Layout>
      <Nav title="Posts" />

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Code of Conduct
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 text-gray-900">
            <div className="px-4 py-6 sm:px-0">
              <h1 className="text-3xl font-bold">Contributor Covenant Code of Conduct</h1>
              <h2 className="text-2xl font-bold">Our Pledge</h2>
              <p className="mb-8">
                We as members, contributors, and leaders pledge to make participation in our
                community a harassment-free experience for everyone, regardless of age, body
                size, visible or invisible disability, ethnicity, sex characteristics, gender
                identity and expression, level of experience, education, socio-economic status,
                nationality, personal appearance, race, religion, or sexual identity
                and orientation.
              </p>
              <p className="mb-8">
                We pledge to act and interact in ways that contribute to an open, welcoming,
                diverse, inclusive, and healthy community.
              </p>
              <h2 className="text-2xl font-bold">Our Standards</h2>
              <p className="mb-8">
                Examples of behavior that contributes to a positive environment for our
                community include:
              </p>
              <ul>
                <li>Demonstrating empathy and kindness toward other people</li>
                <li>Being respectful of differing opinions, viewpoints, and experiences</li>
                <li>Giving and gracefully accepting constructive feedback</li>
                <li>Accepting responsibility and apologizing to those affected by our mistakes,
                  and learning from the experience</li>
                <li>Focusing on what is best not just for us as individuals, but for the
                  overall community</li>
                <li>Be respectful of Direct Messaging. Everyone here is a volunteer just trying
                  to help and getting contacted in DMs can often feel like you're providing free support.</li>
              </ul>
              <p className="mb-8">
                Examples of unacceptable behavior include:
              </p>
              <ul>
                <li>The use of sexualized language or imagery, and sexual attention or
                  advances of any kind</li>
                <li>Trolling, insulting or derogatory comments, and personal or political attacks</li>
                <li>Public or private harassment</li>
                <li>Publishing others' private information, such as a physical or email
                  address, without their explicit permission</li>
                <li>Other conduct which could reasonably be considered inappropriate in a
                  professional setting</li>
              </ul>
              <h2 className="text-2xl font-bold">Enforcement Responsibilities</h2>
              <p className="mb-8">
                Community leaders are responsible for clarifying and enforcing our standards of
                acceptable behavior and will take appropriate and fair corrective action in
                response to any behavior that they deem inappropriate, threatening, offensive,
                or harmful.
              </p>
              <p className="mb-8">
                Community leaders have the right and responsibility to remove, edit, or reject
                comments, commits, code, wiki edits, issues, and other contributions that are
                not aligned to this Code of Conduct, and will communicate reasons for moderation
                decisions when appropriate.
              </p>
              <h2 className="text-2xl font-bold">Scope</h2>
              <p className="mb-8">
                This Code of Conduct applies within all community spaces, and also applies when
                an individual is officially representing the community in public spaces.
                Examples of representing our community include using an official e-mail address,
                posting via an official social media account, or acting as an appointed
                representative at an online or offline event.
              </p>
              <h2 className="text-2xl font-bold">Enforcement</h2>
              <p className="mb-8">
                Instances of abusive, harassing, or otherwise unacceptable behavior may be
                reported to the community leaders responsible for enforcement at
                <a href="mailto:hello@cdk.dev">hello@cdk.dev</a>.
                All complaints will be reviewed and investigated promptly and fairly.
              </p>
              <p className="mb-8">
                All community leaders are obligated to respect the privacy and security of the
                reporter of any incident.
              </p>
              <h2 className="text-2xl font-bold">Enforcement Guidelines</h2>
              <p className="mb-8">
                Community leaders will follow these Community Impact Guidelines in determining
                the consequences for any action they deem in violation of this Code of Conduct:
              </p>
              <h3 className="text-xl">1. Correction</h3>
              <p className="mb-4">
                <strong>Community Impact</strong>: Use of inappropriate language or other behavior deemed
                unprofessional or unwelcome in the community.
              </p>
              <p className="mb-4">
                <strong>Consequence</strong>: A private, written warning from community leaders, providing
                clarity around the nature of the violation and an explanation of why the
                behavior was inappropriate. A public apology may be requested.
              </p>
              <h3 className="text-xl">2. Warning</h3>
              <p className="mb-4">
                <strong>Community Impact</strong>: A violation through a single incident or series
                of actions.
              </p>
              <p className="mb-4">
                <strong>Consequence</strong>: A warning with consequences for continued behavior. No
                interaction with the people involved, including unsolicited interaction with
                those enforcing the Code of Conduct, for a specified period of time. This
                includes avoiding interactions in community spaces as well as external channels
                like social media. Violating these terms may lead to a temporary or
                permanent ban.
              </p>
              <h3 className="text-xl">3. Temporary Ban</h3>
              <p className="mb-4">
                <strong>Community Impact</strong>: A serious violation of community standards, including
                sustained inappropriate behavior.
              </p>
              <p className="mb-4">
                <strong>Consequence</strong>: A temporary ban from any sort of interaction or public
                communication with the community for a specified period of time. No public or
                private interaction with the people involved, including unsolicited interaction
                with those enforcing the Code of Conduct, is allowed during this period.
                Violating these terms may lead to a permanent ban.
              </p>

              <h3 className="text-xl">4. Permanent Ban</h3>
              <p className="mb-4">
                <strong>Community Impact</strong>: Demonstrating a pattern of violation of community
                standards, including sustained inappropriate behavior,  harassment of an
                individual, or aggression toward or disparagement of classes of individuals.
              </p>
              <p className="mb-4">
                <strong>Consequence</strong>: A permanent ban from any sort of public interaction within
                the community.
              </p>
              <h2 className="text-2xl font-bold">Attribution</h2>
              <p>
                This Code of Conduct is adapted from the <a href="/">Contributor Covenant</a>,
                version 2.0, available at <a className="text-blue-400" href="https://www.contributor-covenant.org/version/2/0/code_of_conduct.html">https://www.contributor-covenant.org/version/2/0/code_of_conduct.html</a>.
              </p>
              <p>
                Community Impact Guidelines were inspired by <a className="text-blue-400" href="https://github.com/mozilla/diversity">Mozilla's code of conduct
                enforcement ladder</a>.
              </p>
              <p>
                homepage: <a className="text-blue-400" href="https://www.contributor-covenant.org">https://www.contributor-covenant.org</a>.
                <br/>
                For answers to common questions about this code of conduct, see the FAQ at <a className="text-blue-400" href="https://www.contributor-covenant.org/faq">https://www.contributor-covenant.org/faq</a>.
                <br/>
                Translations are available at <a className="text-blue-400" href="https://www.contributor-covenant.org/translations">https://www.contributor-covenant.org/translations</a>.
              </p>
            </div>
          </div>
        </main>
      </div>

      <CreateContent />
      <Newsletter />
    </Layout>
  )
}

export default coc;