export default {
  slug: 'final-exam',
  title: 'Final Exam',
  sections: [
    {
      id: 'intro',
      heading: 'Put it all together',
      left: {
        1: {
          type: 'text',
          content: `You've made it through all six lessons. You now understand the core ideas behind every AI language model — from simple word prediction all the way to the full transformer architecture.\n\nThis final exam tests what you've learned. There are no tricks. If you understood the lessons, you'll do great.\n\nTake your time. And remember — you started from zero.`,
        },
        3: {
          type: 'text',
          content: `You've covered the full pipeline: tokenization, embeddings, attention, feed-forward layers, training, and generation.\n\nThis final exam covers concepts from all six lessons. Some questions test intuition, others test technical understanding at your level.\n\nLet's see what you've retained.`,
        },
        5: {
          type: 'text',
          content: `You've covered autoregressive generation, BPE tokenization, embedding geometry, scaled dot-product attention, FFN layers, and the training loop.\n\nThis exam tests conceptual and technical understanding across all topics. Good luck.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'q1',
      heading: null,
      left: {
        all: {
          type: 'quiz',
          question: 'What is the fundamental operation of a language model?',
          options: [
            'Understanding the meaning of sentences',
            'Predicting the next token given previous tokens',
            'Translating between languages',
            'Memorizing all text from the internet',
          ],
          correct: 1,
          explanation: 'Language models are autoregressive next-token predictors. Every capability — conversation, coding, translation — emerges from this simple operation repeated over and over.',
        },
      },
      right: { all: { type: 'static', content: null } },
    },
    {
      id: 'q2',
      heading: null,
      left: {
        all: {
          type: 'quiz',
          question: 'Why do models use tokens instead of whole words?',
          options: [
            'Tokens are easier for humans to read',
            'Tokens make the model run faster on GPUs',
            'Subword tokens handle unknown words and keep vocabulary size manageable',
            'Words are too long for computers to process',
          ],
          correct: 2,
          explanation: 'Subword tokenization (like BPE) lets the model handle any word — even ones it has never seen — by composing it from smaller known pieces. This keeps the vocabulary finite while maintaining coverage of all possible text.',
        },
      },
      right: { all: { type: 'static', content: null } },
    },
    {
      id: 'q3',
      heading: null,
      left: {
        all: {
          type: 'quiz',
          question: 'What does the loss function measure during training?',
          options: [
            'How fast the model runs',
            'How many parameters the model has',
            'How wrong the model\'s predictions are',
            'How much data the model has seen',
          ],
          correct: 2,
          explanation: 'The loss function (cross-entropy for language models) quantifies the gap between the model\'s predictions and the correct answers. Training is the process of minimizing this loss by adjusting weights.',
        },
      },
      right: { all: { type: 'static', content: null } },
    },
    {
      id: 'q4',
      heading: null,
      left: {
        all: {
          type: 'quiz',
          question: 'What property makes embeddings useful?',
          options: [
            'They compress text to save storage space',
            'Similar words end up near each other in embedding space',
            'They make text invisible to hackers',
            'They translate words into different languages automatically',
          ],
          correct: 1,
          explanation: 'Embeddings place words in a continuous vector space where geometric distance reflects semantic similarity. "King" and "queen" are close together; "king" and "banana" are far apart.',
        },
      },
      right: { all: { type: 'static', content: null } },
    },
    {
      id: 'q5',
      heading: null,
      left: {
        all: {
          type: 'quiz',
          question: 'What does the attention mechanism do?',
          options: [
            'Makes the model pay attention to the user\'s request',
            'Lets each token figure out which other tokens are most relevant to it',
            'Removes unimportant words from the input',
            'Speeds up the model by skipping unnecessary computation',
          ],
          correct: 1,
          explanation: 'Attention computes relevance scores between all pairs of tokens. Each token builds a context-aware representation by aggregating information from the tokens that matter most for it.',
        },
      },
      right: { all: { type: 'static', content: null } },
    },
    {
      id: 'q6',
      heading: null,
      left: {
        1: {
          type: 'quiz',
          question: 'What does temperature control?',
          options: [
            'How hot the computer gets',
            'How creative vs. predictable the AI\'s word choices are',
            'How fast the model generates text',
            'How many words the model knows',
          ],
          correct: 1,
          explanation: 'Temperature scales the model\'s confidence. Low temperature = focused, predictable output. High temperature = more varied, creative (and sometimes weird) output.',
        },
        3: {
          type: 'quiz',
          question: 'What does lowering the temperature parameter do to the softmax distribution?',
          options: [
            'Makes it more uniform (flatter)',
            'Makes it sharper (peakier), concentrating probability on the top token',
            'Removes low-probability tokens entirely',
            'Has no effect on the output distribution',
          ],
          correct: 1,
          explanation: 'Dividing logits by T < 1 amplifies differences between scores, making softmax concentrate probability mass on the highest-scoring token. As T → 0, this approaches greedy (argmax) decoding.',
        },
      },
      right: { all: { type: 'static', content: null } },
    },
    {
      id: 'q7',
      heading: null,
      left: {
        all: {
          type: 'quiz',
          question: 'In a transformer, what is the correct order of operations?',
          options: [
            'Tokenize → Embed → (Attention + Feed-Forward) × N → Predict',
            'Embed → Tokenize → Predict → Attention',
            'Attention → Embed → Tokenize → Feed-Forward',
            'Predict → Attention → Tokenize → Embed',
          ],
          correct: 0,
          explanation: 'Text is tokenized into pieces, each token is embedded into a vector, then the vectors pass through N layers of attention + feed-forward processing, and finally the model predicts the next token.',
        },
      },
      right: { all: { type: 'static', content: null } },
    },
    {
      id: 'q8',
      heading: null,
      left: {
        1: {
          type: 'quiz',
          question: 'How does a model learn?',
          options: [
            'A human teaches it every answer',
            'It memorizes a list of rules',
            'It makes predictions, measures its mistakes, and adjusts its numbers to be less wrong',
            'It copies answers from the internet in real time',
          ],
          correct: 2,
          explanation: 'Training is an iterative process: predict, measure the error (loss), compute gradients, and update weights. This cycle repeats billions of times across massive datasets.',
        },
        4: {
          type: 'quiz',
          question: 'Which of these is NOT a component of the standard training loop?',
          options: [
            'Forward pass to compute predictions',
            'Loss computation (cross-entropy)',
            'Backward pass to compute gradients',
            'Manually labeling each training example as correct or incorrect',
          ],
          correct: 3,
          explanation: 'Language model training is self-supervised — the "label" is simply the next token in the text. No human labeling is needed for pre-training. The loop is: forward pass → loss → backward pass → weight update.',
        },
      },
      right: { all: { type: 'static', content: null } },
    },
    {
      id: 'complete',
      heading: 'You did it.',
      left: {
        1: {
          type: 'text',
          content: `You started from zero. Now you understand how AI actually works — not the hype, not the magic, but the real ideas underneath.\n\nYou know that AI predicts the next word. You know it sees tokens, not text. You know it learns from its mistakes. You know words live as points in space. You know attention lets the model focus on what matters. And you know how all these pieces stack together into a transformer.\n\nThat's more than most people will ever understand about AI. Be proud of that.\n\nNow go explore. The resources below are hand-picked for your level — they'll take you even further.`,
        },
        3: {
          type: 'text',
          content: `Congratulations. You've built a solid mental model of how modern language models work — from tokenization through embeddings, attention, feed-forward networks, and the training loop.\n\nYou understand the architecture at a level where you could start reading papers, experimenting with code, or building things.\n\nHere are curated resources to keep going. Each one was chosen to match your current understanding and push you further.`,
        },
        5: {
          type: 'text',
          content: `You've covered the core transformer architecture, training dynamics, and generation strategies at a technical level.\n\nFrom here, the best path forward is reading code and papers. The resources below will take you from understanding to implementation and research.\n\nGo build something.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
  ],
};
