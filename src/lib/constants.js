export const LEVELS = [
  {
    id: 1,
    name: 'Explorer',
    description: "I've never written code",
    preview: 'Simple analogies and visual explanations — no code, no math.',
  },
  {
    id: 2,
    name: 'Curious',
    description: "I know what code is but don't write it",
    preview: 'Clear explanations with light technical vocabulary.',
  },
  {
    id: 3,
    name: 'Beginner',
    description: 'I know a little Python',
    preview: 'Real code snippets, basic math, hands-on examples.',
  },
  {
    id: 4,
    name: 'Intermediate',
    description: "I'm comfortable with Python",
    preview: 'Full code, formulas, architecture details.',
  },
  {
    id: 5,
    name: 'Advanced',
    description: 'I know Python well, teach me ML',
    preview: 'PyTorch code, math notation, research-level detail.',
  },
];

export const LESSON_ORDER = [
  'prediction',
  'tokens',
  'learning',
  'embeddings',
  'attention',
  'full-picture',
  'final-exam',
];

export const LESSON_META = {
  prediction: { title: 'Prediction', subtitle: 'AI is just guessing the next thing' },
  tokens: { title: 'Tokens', subtitle: 'Models see numbers, not words' },
  learning: { title: 'Learning', subtitle: 'How a model learns from mistakes' },
  embeddings: { title: 'Embeddings', subtitle: 'Meaning lives in numbers' },
  attention: { title: 'Attention', subtitle: 'The model decides which words matter' },
  'full-picture': { title: 'The Full Picture', subtitle: 'How everything fits together' },
  'final-exam': { title: 'Final Exam', subtitle: 'Test everything you\'ve learned' },
};

export const EXPLORE_RESOURCES = {
  1: [
    { title: '3Blue1Brown: Neural Networks', url: 'https://www.3blue1brown.com/topics/neural-networks', description: 'Beautiful visual explanations of how neural networks learn' },
    { title: 'Google AI Experiments', url: 'https://experiments.withgoogle.com/collection/ai', description: 'Fun interactive demos that show AI in action' },
    { title: 'Teachable Machine', url: 'https://teachablemachine.withgoogle.com/', description: 'Train your own AI model in the browser — no code needed' },
    { title: 'AI Explained (YouTube)', url: 'https://www.youtube.com/@aiexplained-official', description: 'Clear, beginner-friendly videos about AI developments' },
  ],
  2: [
    { title: '3Blue1Brown: Neural Networks', url: 'https://www.3blue1brown.com/topics/neural-networks', description: 'Visual deep-dives into how neural networks learn' },
    { title: 'But what is a GPT? (3B1B)', url: 'https://www.youtube.com/watch?v=wjZofJX0v4M', description: 'Visual breakdown of how GPT models work' },
    { title: 'ChatGPT Prompt Engineering Guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering', description: 'Learn to communicate effectively with language models' },
    { title: 'Hugging Face Learn', url: 'https://huggingface.co/learn', description: 'Gentle introductions to NLP and transformers' },
  ],
  3: [
    { title: 'Fast.ai — Practical Deep Learning', url: 'https://course.fast.ai/', description: 'Free course that teaches deep learning by doing — start training models in week 1' },
    { title: 'Andrej Karpathy: Let\'s build GPT', url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY', description: 'Build a GPT from scratch in Python — best tutorial out there' },
    { title: 'Hugging Face NLP Course', url: 'https://huggingface.co/learn/nlp-course', description: 'Hands-on NLP with transformers library' },
    { title: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/', description: 'Official tutorials from beginner to advanced' },
  ],
  4: [
    { title: 'Andrej Karpathy: Let\'s build GPT', url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY', description: 'Build a GPT from scratch — understand every line' },
    { title: 'The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/', description: 'Jay Alammar\'s legendary visual guide to transformers' },
    { title: 'Lilian Weng\'s Blog', url: 'https://lilianweng.github.io/', description: 'Deep technical posts on attention, RLHF, and more' },
    { title: 'nanoGPT', url: 'https://github.com/karpathy/nanoGPT', description: 'The simplest, fastest GPT training code — great for learning' },
    { title: 'Stanford CS224N', url: 'https://web.stanford.edu/class/cs224n/', description: 'Stanford\'s NLP with Deep Learning course (free lectures)' },
  ],
  5: [
    { title: 'Attention Is All You Need (paper)', url: 'https://arxiv.org/abs/1706.03762', description: 'The original transformer paper — a must-read' },
    { title: 'nanoGPT', url: 'https://github.com/karpathy/nanoGPT', description: 'Minimal GPT implementation — read every line' },
    { title: 'The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/', description: 'Jay Alammar\'s visual guide — pairs perfectly with the paper' },
    { title: 'Lilian Weng: The Transformer Family', url: 'https://lilianweng.github.io/posts/2023-01-27-the-transformer-family-v2/', description: 'Comprehensive survey of transformer variants' },
    { title: 'FlashAttention Paper', url: 'https://arxiv.org/abs/2205.14135', description: 'IO-aware exact attention — the most important systems paper for LLMs' },
    { title: 'Stanford CS224N', url: 'https://web.stanford.edu/class/cs224n/', description: 'Full NLP course with assignments' },
    { title: 'Chinchilla / Scaling Laws', url: 'https://arxiv.org/abs/2203.15556', description: 'The paper that changed how we think about model sizing' },
  ],
};
