export default {
  slug: 'prediction',
  title: 'Prediction',
  sections: [
    {
      id: 'intro',
      heading: 'The sky is ____',
      left: {
        1: {
          type: 'text',
          content: `Imagine someone says to you: "The sky is ____." What word comes next?\n\nYou'd probably say "blue." Maybe "clear" or "dark" or "falling" — but "blue" feels like the most natural answer.\n\nThat's exactly what AI does. It reads a bunch of words and guesses what comes next. That's the whole trick. Seriously — the most powerful AI systems in the world are, at their core, just predicting the next word over and over again.\n\nHow did it get so good at guessing? It learned by reading billions of sentences from books, websites, articles, and more — that's its "database" of language patterns. After all that reading, it picked up on which words tend to follow which.\n\nNo magic. No thinking. Just a really, really good guessing machine.`,
        },
        2: {
          type: 'text',
          content: `Here's a sentence with a blank: "The sky is ____." What word would you fill in?\n\nMost people say "blue." Some might say "clear" or "dark." Your brain automatically ranks the options by how well they fit.\n\nAI language models do the same thing. They take in a sequence of words and predict the most likely next word. Then they take that word, add it to the sequence, and predict the next one. Then the next. That's how they generate entire paragraphs — one prediction at a time.\n\nIt's word prediction, scaled up to an almost unimaginable degree. The model got good at this by training on a massive dataset — billions of sentences from books, websites, Wikipedia, forums, and more. That training data is where it learned all its language patterns.`,
        },
        3: {
          type: 'text',
          content: `Language models work by predicting the next word in a sequence. Given "The sky is," a model assigns a probability to every word in its vocabulary and picks the highest one.\n\nThis is called **autoregressive generation** — the model generates one token at a time, feeding each prediction back as input for the next step.\n\nThe core loop is simple:\n1. Take some input text\n2. Score every possible next word\n3. Pick one (usually the highest-scoring)\n4. Append it to the input\n5. Repeat\n\nEvery chatbot response, every code completion, every AI-generated story — it's all this loop running thousands of times.`,
        },
        4: {
          type: 'text',
          content: `Language models are fundamentally next-token predictors. Given a context sequence, the model computes a probability distribution over its vocabulary and samples (or greedily selects) the next token.\n\nFormally, given tokens x₁, x₂, ..., xₜ, the model estimates P(xₜ₊₁ | x₁, ..., xₜ) for every token in the vocabulary V.\n\nThe model produces a **logit** (raw score) for each vocabulary entry, then applies the **softmax** function to convert these logits into a valid probability distribution. The token with the highest probability is the model's "best guess."\n\nThis autoregressive factorization means the probability of an entire sequence is the product of all conditional probabilities: P(x₁, ..., xₙ) = ∏ P(xₜ | x<ₜ).`,
        },
        5: {
          type: 'text',
          content: `Autoregressive language models compute P(xₜ | x₁, ..., xₜ₋₁) over a vocabulary V of size |V| (typically 32k–128k tokens).\n\nThe model architecture maps input token IDs through an embedding layer, processes them through transformer blocks, and projects the final hidden state back to vocabulary space via a linear layer (the "LM head"), producing a logit vector z ∈ ℝ^|V|.\n\nThe probability distribution is obtained via softmax:\n\nP(xₜ = w | x<ₜ) = exp(zw) / Σⱼ exp(zⱼ)\n\nSequence probability factorizes autoregressively:\nP(x₁:ₙ) = ∏ₜ P(xₜ | x<ₜ)\n\nTraining minimizes the cross-entropy loss (negative log-likelihood) over a corpus, which is equivalent to minimizing the KL divergence between the model's distribution and the empirical data distribution.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'how-it-picks',
      heading: 'How prediction works',
      left: {
        1: {
          type: 'text',
          content: `When the AI sees "The sky is," it doesn't just pick one word. It looks at ALL the words it knows — thousands and thousands of them — and gives each one a score.\n\n"Blue" gets a high score. "Green" gets a lower score. "Refrigerator" gets a very low score (because skies usually aren't refrigerators).\n\nThink of it like a bar chart. Each word has a bar, and taller bars mean the AI thinks that word is more likely to come next. The AI then picks the word with the tallest bar.\n\nLook at the bar chart below — you can see which words the AI thinks are most likely for "The sky is ____."`,
        },
        2: {
          type: 'text',
          content: `The model doesn't just magically know the next word. It scores every single word in its vocabulary — which could be tens of thousands of words.\n\nEach word gets a number representing how confident the model is that it comes next. "Blue" might get 0.35 (35% chance), "clear" might get 0.15 (15% chance), and "banana" might get 0.0001 (basically zero).\n\nThese numbers always add up to 1.0 (100%) because they form a **probability distribution** — the model is essentially dividing up its confidence across all possible words.\n\nThe model then picks the word with the highest probability.`,
        },
        3: {
          type: 'text',
          content: `The model outputs a score for every word in its vocabulary. These raw scores are called **logits**.\n\nLogits can be any number — positive, negative, huge, tiny. To turn them into proper probabilities (between 0 and 1, summing to 1), we pass them through the **softmax** function:\n\nprobability(word) = e^(score for word) / sum of e^(score) for all words\n\nThis amplifies differences: high-scored words get much higher probabilities than low-scored ones.\n\nAfter softmax, you have a probability distribution over the entire vocabulary. Picking the word with the highest probability is called **greedy decoding**.`,
        },
        5: {
          type: 'text',
          content: `The final linear projection (LM head) maps the last hidden state h ∈ ℝ^d to logit vector z = Wh + b where W ∈ ℝ^(|V| × d).\n\nSoftmax converts logits to probabilities:\n\nP(w | context) = softmax(z)_w = exp(z_w) / Σⱼ exp(z_j)\n\nIn practice, numerical stability requires the log-sum-exp trick: subtract max(z) before exponentiating.\n\nDecoding strategies:\n- **Greedy**: argmax P(w | context)\n- **Beam search**: maintain top-k partial sequences\n- **Sampling**: draw from P (optionally with temperature, top-k, or nucleus/top-p truncation)\n\nGreedy decoding is deterministic but can produce repetitive text. Sampling introduces diversity at the cost of potential incoherence.`,
        },
      },
      right: {
        1: { type: 'diagram', component: 'ProbabilityBars' },
        2: { type: 'diagram', component: 'ProbabilityBars' },
        3: {
          type: 'code',
          code: `scores = model(sentence)\nprobs = softmax(scores)\nnext_word = pick_highest(probs)\n\n# Example output:\n# "blue"  → 0.35\n# "clear" → 0.15\n# "dark"  → 0.12\n# "gray"  → 0.08\n# "red"   → 0.04`,
          annotations: {0: 'Get raw scores for every word', 1: 'Turn into probabilities', 2: 'Pick the winner'},
        },
        4: {
          type: 'code',
          code: `logits = model(input_ids)          # shape: (1, seq_len, vocab_size)\nlast_logits = logits[:, -1, :]     # shape: (1, vocab_size)\nprobs = softmax(last_logits)       # normalize to probabilities\nnext_id = argmax(probs)            # greedy decoding\nnext_word = vocab[next_id]         # map back to text`,
          annotations: {0: 'Forward pass', 1: 'Take last position only', 2: 'Softmax over vocabulary', 3: 'Pick highest probability', 4: 'Decode token ID to word'},
        },
        5: {
          type: 'code',
          code: `logits = model(input_ids)  # (batch, seq_len, vocab_size)\nprobs = F.softmax(logits[:, -1, :], dim=-1)\n\n# Greedy\nnext_token = probs.argmax(dim=-1)\n\n# Or sample with temperature\nscaled = logits[:, -1, :] / temperature\nprobs_t = F.softmax(scaled, dim=-1)\nnext_token = torch.multinomial(probs_t, 1)`,
          annotations: {},
        },
      },
    },
    {
      id: 'try-it',
      heading: 'Try it yourself',
      left: {
        1: {
          type: 'text',
          content: `Now it's your turn. Below you'll see a sentence with a blank. **Tap on the word you think the AI would pick.** The bars show how confident the AI is about each option — taller bars mean more likely.\n\nAfter you pick, you'll see if you matched the AI's top choice. Then hit **"Try another sentence"** to see more examples.\n\nNotice something: you're actually really good at this! Your brain predicts words all the time — when you read, when you listen, when you finish someone's sentence. AI is doing the same thing, just with math instead of neurons.`,
        },
        3: {
          type: 'text',
          content: `Try the demo below. **Click a word to guess the AI's top pick**, then press **"Try another sentence"** to cycle through examples.\n\nNotice how:\n- Some contexts make prediction easy ("2 + 2 = ____" → very confident)\n- Some contexts are ambiguous ("I love to ____" → many reasonable completions)\n- The probability distribution shape tells you about the model's certainty\n\nA **sharp** distribution (one dominant bar) means the context strongly implies a specific continuation. A **flat** distribution means many words are roughly equally plausible.`,
        },
      },
      right: {
        all: { type: 'interactive', component: 'PredictionDemo' },
      },
    },
    {
      id: 'temperature',
      heading: 'Temperature',
      left: {
        1: {
          type: 'text',
          content: `Sometimes you want the AI to be creative. Sometimes you want it to be precise.\n\nImagine you're turning a dial. Turn it down, and the AI becomes very focused — it almost always picks the most likely word. Turn it up, and the AI becomes more adventurous, sometimes picking surprising words.\n\nThis dial is called **temperature**.\n\nLow temperature: "The sky is **blue**." (safe, predictable)\nHigh temperature: "The sky is **weeping**." (creative, unexpected)\n\n**Try the slider below** — drag it from "Focused" to "Creative" and watch how the bars change. Low temperature makes one word dominate. High temperature spreads the bars out, giving the AI more options.`,
        },
        2: {
          type: 'text',
          content: `There's a setting you can adjust called **temperature** that controls how random the model's predictions are.\n\n**Low temperature (0.1–0.5):** The model strongly favors its top picks. The probability distribution becomes "peaky" — one word dominates. Good for factual, predictable text.\n\n**High temperature (1.0–2.0):** The model spreads its confidence more evenly. Less common words get a real chance of being picked. Good for creative writing.\n\n**Temperature = 1.0** is the default — the raw probabilities the model learned during training.\n\n**Drag the slider below** to see how temperature reshapes the probabilities. Notice how low temperature makes one word dominate, while high temperature flattens everything out.`,
        },
        3: {
          type: 'text',
          content: `Temperature is applied before softmax by dividing the logits:\n\nadjusted_scores = scores / temperature\n\nWhen temperature < 1: logits are amplified, making the distribution sharper (more confident).\nWhen temperature > 1: logits are dampened, making the distribution flatter (more random).\nWhen temperature → 0: approaches greedy decoding (always picks the top word).\nWhen temperature → ∞: approaches uniform distribution (completely random).\n\nThis is one of the simplest but most impactful knobs for controlling text generation.`,
        },
        5: {
          type: 'text',
          content: `Temperature scaling modifies the softmax computation:\n\nP(w) = exp(z_w / T) / Σⱼ exp(z_j / T)\n\nwhere T is the temperature. The gradient of the entropy H of the distribution with respect to T is always positive — higher T always increases entropy.\n\nAs T → 0⁺, the distribution converges to a one-hot vector at argmax(z). As T → ∞, it converges to uniform.\n\nIn practice, temperature is often combined with **top-k** (zero out all but top k logits) and **nucleus sampling / top-p** (zero out logits below a cumulative probability threshold p). These truncation methods prevent sampling from the long tail of low-probability tokens.`,
        },
      },
      right: {
        all: { type: 'interactive', component: 'TemperatureDemo' },
      },
    },
    {
      id: 'quiz',
      heading: null,
      left: {
        all: {
          type: 'quiz',
          question: 'What is a language model fundamentally doing?',
          options: [
            'Predicting the next word in a sequence',
            'Searching the internet for answers',
            'Copying text from a database',
            'Understanding the meaning of words',
          ],
          correct: 0,
          explanation: 'Language models are next-word prediction machines. They estimate the probability of every possible next word given the words so far, then pick one. Everything else — conversations, code, essays — emerges from this simple mechanism.',
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'whats-next',
      heading: "What's next",
      left: {
        1: {
          type: 'text',
          content: `You now know the core idea behind every AI language model: **predict the next word**.\n\nOne important thing to understand: the AI doesn't store all those sentences it read during training like a database you can search. Instead, it compressed what it learned into millions of numbers called weights. The training data is gone — what's left is the patterns.\n\nBut here's a question — when we say the AI looks at "words," what does it actually see? It can't read letters the way you do. It doesn't see "blue" and think "that's a color."\n\nIt turns out, AI doesn't see words at all. It sees numbers.\n\nIn the next lesson, we'll learn how text gets turned into something a computer can actually work with. Get ready to meet **tokens**.`,
        },
        3: {
          type: 'text',
          content: `You've learned that language models predict next tokens by computing probability distributions over their vocabulary.\n\nBut what exactly is in that vocabulary? The model doesn't work with English words directly. It works with **tokens** — chunks of text that are often smaller than words.\n\n"unhappiness" might become three tokens: \`["un", "happi", "ness"]\`. And each token is really just a number — an index into a big lookup table.\n\nNext lesson: how text becomes tokens, and how tokens become numbers.`,
        },
        5: {
          type: 'text',
          content: `You now understand the autoregressive generation framework and the role of logits, softmax, and temperature in shaping the output distribution.\n\nNext, we'll examine the input side: **tokenization**. The vocabulary V that defines the output space also defines how raw text is segmented into discrete input units. We'll look at Byte-Pair Encoding (BPE), the dominant subword tokenization algorithm, and understand why the choice of tokenizer fundamentally shapes what the model can learn.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
  ],
};
