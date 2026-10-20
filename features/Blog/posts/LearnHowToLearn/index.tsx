import React from 'react';
import Callout from '@/features/Blog/components/Callout';
import CodeBlock from '@/features/Blog/components/CodeBlock';
import Reveal from '@/features/Blog/components/Reveal';
import { lazyOnView } from '@/features/Blog/components/LazyOnView';

// The only widget sits far below the first screen: its HTML is in the static page, its JS loads on scroll.
const ForgettingCurveSimulator = lazyOnView(() => import('./widgets/forgettingCurve/components/ForgettingCurveSimulator'));

export default function LearnHowToLearn() {
  return (
    <div className="blog-content-static">
      <p>In school I could learn a hard video game in a weekend, but I was failing math. My grades sat around 60%, and I was teased for not knowing things that other kids knew. I thought I was bad at school.</p>

      <p>I was wrong about the reason. I could already practice one thing for hours: I spent whole days on aiming drills in <em>CS:GO</em> and on <em>Dota 2</em> strategy. The habit was there. It was pointed at the wrong target.</p>

      <p>This post is what I learned after I pointed it at school and, later, at software. You will get:</p>
      <ul>
        <li><strong>Why the basics come first</strong>, and why skipping them makes everything after harder.</li>
        <li><strong>3 study methods with good evidence</strong>: testing yourself, spacing your reviews, and chunking.</li>
        <li><strong>A way to plan your reviews</strong>, with a chart you can play with.</li>
      </ul>

      <Reveal>
        <h2>Point the practice at the right target</h2>

        <p>In high school I found the <strong>Pomodoro technique</strong>: work for 25 minutes, take a 5-minute break, and repeat. It did not make me smarter. It made starting easy, because 25 minutes is short, and it kept me focused until the break.</p>

        <p>Within a few months my grades went from about 60% to above 85%. That is my own experience, not proof that Pomodoro works for everyone. The timer was a tool. The real change was that I treated studying the way I treated a game: show up every day and practice the part you are bad at.</p>

        <h2>Learn the prerequisites first</h2>

        <p>When I started teaching myself, I often hit material I could not follow at all. The cause was almost always the same: I was missing something it depended on.</p>

        <p>Researchers call this the effect of <strong>prior knowledge</strong>: new ideas are easier to learn when they connect to ideas you already hold. When there is nothing to connect to, you can read the same page 5 times and keep nothing.</p>

        <p>It is like fighting a late-game boss at level 1. You might win after 100 tries, but going back to level up first is faster.</p>

        <p>So learn what a topic depends on before the topic itself:</p>
        <ul>
          <li>Basic algebra before calculus. Calculus problems are full of algebra steps.</li>
          <li>Loops, functions and how computer memory works before a framework. A framework is those basics, arranged for you.</li>
        </ul>

        <p>It feels slow while you do it. The payoff comes later: each new topic takes less effort, because it builds on what you already know.</p>

        <h2>What this looked like for me</h2>

        <p>My path into software followed the same rule:</p>
        <ul>
          <li><strong>Basics first.</strong> I spent about a year on <a href="https://cs50.harvard.edu/x/" target="_blank" rel="noopener noreferrer">CS50</a>, Harvard's free intro to computer science, learning what a loop is and how computer memory works.</li>
          <li><strong>Then real projects.</strong> An internship and Bangkit Academy, a tech training program in Indonesia backed by Google, showed me how code runs for real users. The basics made that easier to follow.</li>
          <li><strong>Then new areas.</strong> I started as a frontend engineer and moved into backend and DevOps. New languages and tools came faster each time, because most of what they rely on I had already learned.</li>
        </ul>

        <h2>Test yourself instead of re-reading</h2>

        <p>Most people study by reading their notes again. It feels productive, because the text looks familiar. But familiar is not the same as remembered. Recognizing a page is much easier than recalling it with the book closed, and an exam asks you to recall.</p>

        <p><strong>Retrieval practice</strong> means pulling information out of your memory instead of putting it in again. The act of recalling makes the memory stronger. In a well-known study, Roediger and Karpicke (2006) had students read a short text. Some read it again. Others wrote down what they remembered. After 5 minutes the re-readers did better. After 1 week the students who had tested themselves remembered more. A large review of study methods, Dunlosky and others (2013), named practice testing and spaced practice as the 2 most useful of the 10 methods they reviewed, and re-reading as one of the least.</p>

        <p>How to do it:</p>
        <ul>
          <li><strong>Close the book and write down what you remember.</strong> Then open it and check what you missed. That check is your feedback: it shows you what to study next.</li>
          <li><strong>Use flashcards</strong>, with a question on one side and the answer on the other. Say the answer before you flip.</li>
          <li><strong>Explain it out loud</strong>, to a friend or to an empty room. The parts where you stop are the parts you do not know yet.</li>
        </ul>

        <Callout variant="tip" title="It should feel hard">
          Self-testing feels worse than re-reading, because you see what you forgot. That struggle is what makes it work.
        </Callout>

        <h2>Space your reviews</h2>

        <p>In 1885 the German psychologist Hermann Ebbinghaus memorized lists of nonsense syllables and measured how quickly he could relearn them hours and days later. The result is called the <strong>forgetting curve</strong>. Memory of new material drops fast at first and then levels off. Each review made at the right time makes the next drop slower.</p>

        <p>This leads to <strong>spaced practice</strong>: spread your reviews out over time instead of doing them all at once. The finding that spaced reviews beat the same amount of study packed together is called the <strong>spacing effect</strong>, and it is one of the most repeated results in learning research.</p>

        <p>Try it below. Pick a schedule, or click days to build your own, and compare 4 reviews on 4 days in a row with 4 reviews spread over 2 weeks. The main number is your average recall over the whole month, because a review the day before you are measured says little about what you kept.</p>
      </Reveal>

      <ForgettingCurveSimulator />

      <Reveal>
        <p>The chart is a simple model with made-up rates, so read its shape, not its numbers. Real forgetting depends on the material, on you, and on how well you learned it the first time. The shape still holds: cramming gives you a high score this week and little a month later, while spaced reviews keep more with the same number of reviews.</p>

        <p>A simple schedule to start with: review <strong>1 day</strong> after you learn something, then after <strong>3 days</strong>, <strong>1 week</strong> and <strong>2 weeks</strong>. Treat it as a starting point, not a rule. If a review feels easy, wait longer next time. If you forgot most of it, review sooner. Flashcard apps such as Anki do this scheduling for you.</p>

        <p>Spacing and self-testing work best together. Each review should be a small test, not a re-read.</p>

        <h2>Chunk it, and step away when stuck</h2>

        <p>Your working memory, the part of your mind that holds what you are thinking about right now, can only hold a few things at once. <strong>Chunking</strong> is how you get around that: you group small pieces into one unit that you can recall as a whole.</p>

        <p>Code is a good example. The first time you see this loop, it is a lot of separate pieces: a variable, a start value, a condition, an increment, an index, an addition.</p>

        <CodeBlock language="javascript" title="6 pieces, or one chunk">
{`let total = 0;
for (let i = 0; i < prices.length; i++) {
  total += prices[i];
}`}
        </CodeBlock>

        <p>After you have written it 50 times, you see one thing: "add up the array". That frees your working memory for the actual problem. You build chunks the same way you build any skill: understand the idea first, then practice it until you do not have to think about the steps.</p>

        <p>The other half is what to do when you are stuck. Barbara Oakley, who teaches the popular <a href="https://www.coursera.org/learn/learning-how-to-learn" target="_blank" rel="noopener noreferrer">Learning How to Learn</a> course on Coursera with Terrence Sejnowski, describes 2 modes of thinking. <strong>Focused mode</strong> is when you concentrate hard on one problem. <strong>Diffuse mode</strong> is the relaxed state when you walk, shower or rest, and your mind makes looser connections.</p>

        <p>Treat this as a teaching model, not settled brain science. The practical advice is still sound: when you have been stuck for a long time, take a real break. Go for a walk, sleep on it, then come back. The answer often shows up after you stop pushing.</p>

        <h2>Time plus a method</h2>

        <p>I used to say there are no geniuses, only time. The honest version is more careful. Time alone does not make you good: you can practice something badly for years. What helps is time spent with a good method, plus regular feedback that tells you what you got wrong.</p>

        <p>With those 3 things, steady progress is likely. It is not guaranteed, and people move at different speeds. But where you start matters much less than I believed when I was the kid with 60% grades.</p>

        <h2>What to keep</h2>
        <ul>
          <li><strong>Learn the prerequisite first.</strong> If you cannot follow something, find what it depends on.</li>
          <li><strong>Test yourself instead of re-reading.</strong> Close the book, recall, then check what you got wrong.</li>
          <li><strong>Spread reviews over growing gaps.</strong> Start with 1 day, 3 days, 1 week, 2 weeks.</li>
          <li><strong>When stuck, take a break and come back.</strong> A real break, not a different screen.</li>
        </ul>

        <h2>Further reading</h2>
        <ul>
          <li>Hermann Ebbinghaus (1885), <em>Über das Gedächtnis</em>, translated in 1913 as <em>Memory: A Contribution to Experimental Psychology</em>. The original forgetting curve.</li>
          <li>Henry L. Roediger III and Jeffrey D. Karpicke (2006), &quot;Test-Enhanced Learning: Taking Memory Tests Improves Long-Term Retention&quot;, <em>Psychological Science</em>.</li>
          <li>John Dunlosky and others (2013), &quot;Improving Students' Learning With Effective Learning Techniques&quot;, <em>Psychological Science in the Public Interest</em>.</li>
          <li>Barbara Oakley and Terrence Sejnowski, <a href="https://www.coursera.org/learn/learning-how-to-learn" target="_blank" rel="noopener noreferrer">Learning How to Learn</a>, a course on Coursera that you can audit for free.</li>
        </ul>
      </Reveal>
    </div>
  );
}
