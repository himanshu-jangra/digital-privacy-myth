/* ===== quiz.js — Privacy Awareness Quiz ===== */

const QUESTIONS = [
  { q: "Incognito/Private mode hides your browsing activity from your internet service provider.", options: ["True, ISPs can't see anything in private mode","False, it only hides history from other users on the same device","True, but only on mobile devices","False, it only works on Chrome"], correct: 1, explanation: "Private/incognito mode only prevents your browser from saving your local browsing history. Your ISP, employer, and the websites you visit can still see your activity." },
  { q: "Which type of company profits most from selling your behavioural data?", options: ["Social media platforms","Search engines","Data brokers","Cloud storage providers"], correct: 2, explanation: "Data brokers are companies whose entire business model revolves around collecting, packaging, and selling personal data. They aggregate data from hundreds of sources to build detailed profiles." },
  { q: 'What is a "chilling effect" in the context of digital surveillance?', options: ["When servers overheat from processing surveillance data","Self-censorship due to the awareness of being watched","A cooling-off period after a data breach","The slowdown of internet speeds due to monitoring"], correct: 1, explanation: "The chilling effect refers to people modifying their behaviour, self-censoring speech, avoiding certain searches, or not visiting certain websites, simply because they know they might be watched." },
  { q: "GDPR gives EU citizens the right to:", options: ["Sue any company that collects data","Request complete deletion of their personal data","Automatically block all cookies","Access the dark web legally"], correct: 1, explanation: "The GDPR's 'Right to Erasure' (Article 17) allows EU citizens to request that organisations delete their personal data under certain conditions." },
  { q: "Which action leaves the LEAST digital footprint?", options: ["Browsing in incognito mode on home Wi-Fi","Using a VPN on public Wi-Fi with DNS-over-HTTPS","Posting on social media with a pseudonym","Using a search engine while logged out"], correct: 1, explanation: "Combining a VPN with DNS-over-HTTPS on public Wi-Fi minimises your digital footprint by encrypting your traffic, masking your IP, and preventing DNS leaks though no method is 100% anonymous." },
  { q: '"I have nothing to hide, so I have nothing to fear." This argument is:', options: ["Valid, only criminals need privacy","Flawed, privacy is a structural right, not just personal secrecy","Partially true, it depends on your country","Outdated, it was true before social media"], correct: 1, explanation: "Privacy is a fundamental right that protects freedom of thought, expression, and association. Arguing you don't need privacy because you have nothing to hide is like saying you don't need free speech because you have nothing to say." },
  { q: 'What does "data aggregation" mean in the context of privacy?', options: ["Deleting old data to free up storage","Combining small, harmless data points into a revealing profile","Encrypting data before transmission","Storing data across multiple servers"], correct: 1, explanation: "Data aggregation is the process of combining individually harmless pieces of information to create a detailed, often invasive, profile of a person revealing habits, preferences, health status, and more." },
  { q: "Which law requires companies to report data breaches within 72 hours?", options: ["CCPA (California)","HIPAA (US Healthcare)","GDPR (EU)","COPPA (US Children's)"], correct: 2, explanation: "GDPR Article 33 requires data controllers to notify supervisory authorities within 72 hours of becoming aware of a personal data breach, unless the breach is unlikely to result in risk to individuals." },
  { q: "What is 'browser fingerprinting'?", options: ["Scanning your fingerprint to log into websites","Tracking users by their unique browser and device configuration","A security feature that protects your identity","A method of encrypting browser data"], correct: 1, explanation: "Browser fingerprinting collects details about your browser type, version, installed plugins, screen resolution, time zone, and more to create a unique identifier tracking you even without cookies." },
  { q: "Which of these is NOT typically collected by a smartphone app with 'basic' permissions?", options: ["Your location history","Your contact list","Your retinal scan","Your device's unique identifier"], correct: 2, explanation: "While location, contacts, and device IDs are commonly accessed by apps (often without users realising), retinal scans require specialised hardware and explicit biometric permissions." },
  { q: "What is a 'shadow profile'?", options: ["A backup copy of your social media profile","Data collected about you by platforms you've never joined","A fake profile created by hackers","Your profile as seen by people you've blocked"], correct: 1, explanation: "Shadow profiles are built when platforms collect data about non-users through contact uploads, tagged photos, and web tracking — meaning Facebook or LinkedIn may have a profile on you even if you've never signed up." },
  { q: "The 'right to be forgotten' allows you to:", options: ["Delete your entire internet history from all servers","Request search engines remove outdated or irrelevant results about you","Make your social media accounts invisible","Erase all government records about you"], correct: 1, explanation: "The right to be forgotten, established in EU law, primarily allows individuals to request that search engines de-index results that are outdated, irrelevant, or no longer in the public interest." },
  { q: "What percentage of mobile apps share data with third parties?", options: ["About 10%","About 30%","About 50%","Over 70%"], correct: 3, explanation: "Studies consistently show that over 70% of mobile apps share data with third-party tracking companies. Many popular free apps have dozens of embedded trackers collecting user data." },
  { q: "Which of these is the most secure form of two-factor authentication?", options: ["SMS text message codes","Email verification links","Hardware security keys (like YubiKey)","Security questions"], correct: 2, explanation: "Hardware security keys provide the strongest 2FA because they're resistant to phishing, can't be intercepted like SMS, and require physical possession. SMS-based 2FA is vulnerable to SIM-swapping attacks." },
  { q: "What does end-to-end encryption (E2EE) actually protect?", options: ["Your data from everyone, including the service provider","Your data from hackers only","Your data from government surveillance only","Your data while it's stored on your device"], correct: 0, explanation: "True end-to-end encryption means only the sender and recipient can read the messages not even the company providing the service can access the content. This is why it's considered the gold standard for private communication." }
];

let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function startQuiz() {
  currentQuestions = shuffleArray(QUESTIONS).slice(0, 5);
  currentIndex = 0; score = 0; answered = false;
  document.getElementById('quiz-landing').style.display = 'none';
  document.getElementById('quiz-question').style.display = 'block';
  document.getElementById('quiz-result').style.display = 'none';
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const q = currentQuestions[currentIndex];
  document.getElementById('q-text').textContent = q.q;
  document.getElementById('q-counter').textContent = `Question ${currentIndex + 1} of 5`;

  // Progress dots
  const dots = document.querySelectorAll('.quiz-progress-dot');
  dots.forEach((d, i) => { d.className = 'quiz-progress-dot' + (i < currentIndex ? ' done' : i === currentIndex ? ' active' : ''); });

  const optionsEl = document.getElementById('q-options');
  optionsEl.innerHTML = '';
  document.getElementById('q-explanation').style.display = 'none';
  document.getElementById('q-next').style.display = 'none';

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(i));
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(idx) {
  if (answered) return;
  answered = true;
  const q = currentQuestions[currentIndex];
  const buttons = document.querySelectorAll('.quiz-option');

  buttons.forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === q.correct) btn.classList.add('correct');
    else if (i === idx) btn.classList.add('wrong');
  });

  if (idx === q.correct) score++;

  document.getElementById('q-explanation-text').textContent = q.explanation;
  document.getElementById('q-explanation').style.display = 'block';
  document.getElementById('q-next').style.display = 'inline-flex';
  document.getElementById('q-next').textContent = currentIndex < 4 ? 'Next Question →' : 'See Results →';
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= 5) { showResults(); return; }
  renderQuestion();
}

function getPersona(s) {
  if (s <= 1) return { emoji: '🔓', name: 'The Exposed', verdict: "You're an open book online and not in a good way. Time to read one." };
  if (s <= 3) return { emoji: '👁', name: 'The Observed', verdict: "You're aware, but still leaving doors open. You know what to do." };
  if (s === 4) return { emoji: '🛡', name: 'The Cautious', verdict: "You're informed and careful. You'd enjoy the deeper dive." };
  return { emoji: '🔐', name: 'The Encrypted', verdict: "Rare. You think like a privacy advocate. Now spread the word." };
}

function showResults() {
  document.getElementById('quiz-question').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'block';
  const persona = getPersona(score);
  document.getElementById('result-emoji').textContent = persona.emoji;
  document.getElementById('result-name').textContent = persona.name;
  document.getElementById('result-score').textContent = `${score}/5`;
  document.getElementById('result-verdict').textContent = persona.verdict;
  renderScoreCard(persona);
}

function renderScoreCard(persona) {
  const canvas = document.getElementById('scorecard');
  canvas.width = 1080; canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, 1080, 1080);

  // Border accent
  ctx.strokeStyle = '#00ff9d';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, 1000, 1000);

  // Book title
  ctx.fillStyle = '#00ff9d';
  ctx.font = '600 42px Teko, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DIGITAL PRIVACY IS A MYTH*', 540, 160);

  // Divider
  ctx.beginPath();
  ctx.moveTo(340, 200); ctx.lineTo(740, 200);
  ctx.strokeStyle = '#222'; ctx.lineWidth = 1; ctx.stroke();

  // Persona emoji
  ctx.font = '120px serif';
  ctx.fillText(persona.emoji, 540, 420);

  // Persona name
  ctx.fillStyle = '#e8e8e8';
  ctx.font = '700 64px Teko, sans-serif';
  ctx.fillText(persona.name.toUpperCase(), 540, 530);

  // Score
  ctx.fillStyle = '#00ff9d';
  ctx.font = '500 48px JetBrains Mono, monospace';
  ctx.fillText(`${score}/5`, 540, 620);

  // Verdict
  ctx.fillStyle = '#888';
  ctx.font = '400 24px Hind Madurai, sans-serif';
  const words = persona.verdict.split(' ');
  let line = '', y = 700;
  words.forEach(word => {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > 800) { ctx.fillText(line.trim(), 540, y); y += 36; line = word + ' '; }
    else line = test;
  });
  ctx.fillText(line.trim(), 540, y);

  // URL
  ctx.fillStyle = '#00ff9d';
  ctx.font = '500 22px JetBrains Mono, monospace';
  ctx.fillText('https://privacymyth.himanshujangra.in', 540, 980);
}

function saveScoreCard() {
  const canvas = document.getElementById('scorecard');
  const link = document.createElement('a');
  link.download = 'my-privacy-score.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

async function shareScoreCard() {
  const canvas = document.getElementById('scorecard');
  if (navigator.share && navigator.canShare) {
    try {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'my-privacy-score.png', { type: 'image/png' });
        await navigator.share({ title: 'My Privacy Score', text: `I scored ${score}/5 on the Digital Privacy Quiz!`, files: [file] });
      });
    } catch { fallbackShare(); }
  } else { fallbackShare(); }
}

function fallbackShare() {
  navigator.clipboard.writeText(`I scored ${score}/5 on the Digital Privacy Quiz! Test yours at https://privacymyth.himanshujangra.in/quiz.html`);
  const btn = document.getElementById('share-btn');
  btn.textContent = '✓ Link Copied!';
  setTimeout(() => { btn.textContent = '📤 Share'; }, 2000);
}

function retakeQuiz() {
  startQuiz();
}
