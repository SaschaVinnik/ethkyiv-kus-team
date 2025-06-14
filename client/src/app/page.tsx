// app/page.tsx
'use client';

import styles from './page.module.css';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ShieldCheck, Users, Scale, Cpu, Lock, CheckCircle, DatabaseZap, KeyRound } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <main className={styles.main}>
      {/* <Image src="/handshake.jpg" alt="Handshake" className={styles.bgImage1} width={400} height={300} />
      <Image src="/crypto-icon.png" alt="Crypto Icon" className={styles.bgImage2} width={100} height={100} /> */}

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent} data-aos="fade-up">
          <h1>Verdicto</h1>
          <p>
            Resolve corporate conflicts transparently with blockchain and trusted mediators.
          </p>
          <div className={styles.buttons}>
            <button className={styles.primary}>I have a conflict</button>
            <button className={styles.secondary}>I want to help</button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.steps}>
        <h2 data-aos="fade-up">How it works</h2>
        <div className={styles.stepGrid}>
          <div className={styles.step} data-aos="fade-right">
            <Scale size={40} />
            <h3>Submit your case</h3>
            <p>Describe the issue and upload any supporting documents. You can remain pseudonymous.</p>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.step} data-aos="fade-up">
            <Users size={40} />
            <h3>Find the right mediator</h3>
            <p>We match you with a certified mediator based on reputation, experience and topic of dispute.</p>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.step} data-aos="fade-left">
            <ShieldCheck size={40} />
            <h3>Reach a resolution</h3>
            <p>The mediator facilitates fair resolution. The outcome is immutably stored on-chain with option for NFT proof.</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className={styles.trust}>
        <h2 data-aos="fade-up">Real Stories from Our Users</h2>
        <div className={styles.caseGrid}>
          <div className={styles.case} data-aos="zoom-in">
            <h4>🧑‍⚖️ Case #1289</h4>
            <p>
              "We were stuck in a deadlock with a former co-founder over vesting rights. Thanks to Verdicto, we reached an agreement
              in less than a week without costly legal battles. The blockchain record gave us peace of mind."
            </p>
            <span>– Anonymous Startup Founder</span>
          </div>
          <div className={styles.case} data-aos="zoom-in" data-aos-delay="100">
            <h4>🏢 Case #1174</h4>
            <p>
              "Verdicto matched us with a mediator that truly understood IP law. The dispute was solved remotely and both parties
              left satisfied. We saved time and thousands in legal fees."
            </p>
            <span>– CTO of SaaS company</span>
          </div>
          <div className={styles.case} data-aos="zoom-in" data-aos-delay="200">
            <h4>🌐 Case #1066</h4>
            <p>
              "Even in our DAO where there’s no central leadership, we managed to vote and execute a binding resolution thanks to
              Verdicto’s on-chain mechanism."
            </p>
            <span>– DAO Governance Member</span>
          </div>
        </div>
      </section>

      {/* Technical Section */}
      <section className={styles.tech}>
        <h2 data-aos="fade-up">Why Verdicto is Technically Trusted</h2>
        <ul className={styles.techList}>
          <li data-aos="fade-right"><Cpu size={20} /> Smart contracts on Ethereum</li>
          <li data-aos="fade-right" data-aos-delay="100"><Lock size={20} /> End-to-end encrypted file submissions</li>
          <li data-aos="fade-right" data-aos-delay="200"><CheckCircle size={20} /> Mediator reputation tied to NFTs</li>
          <li data-aos="fade-right" data-aos-delay="300"><DatabaseZap size={20} /> Immutable records on IPFS</li>
          <li data-aos="fade-right" data-aos-delay="400"><KeyRound size={20} /> Decentralized ID (DID) login and privacy</li>
        </ul>
      </section>
    </main>
  );
}
