export default {
  slug: 'tokens',
  title: 'Tokens',
  sections: [
    {
      id: 'words-arent-words',
      heading: "Words aren't words",
      left: {
        1: {
          type: 'text',
          content: `You might assume that when an AI reads "The sky is blue," it sees four words — just like you do.\n\nIt doesn't. The model has no idea what a "word" is. It can't read letters. It doesn't know what spaces mean.\n\nInstead, the model breaks text into small chunks called **tokens**. Sometimes a token is a whole word. Sometimes it's part of a word. Sometimes it's just a single character.\n\nThink of it like this: you read words, but the AI reads puzzle pieces. It chops text into pieces that are easy for it to work with, even if those pieces look weird to us.\n\nBefore the model can learn anything from its training data — all those books, websites, and articles — it first needs to break that text into tokens. Tokenization is always the very first step.`,
        },
        2: {
          type: 'text',
          content: `AI models don't process text the way we do. When you see "Hello world," you instantly recognize two words. But a model needs to convert text into a format it can handle — a sequence of **tokens**.\n\nA token is a chunk of text. It might be a whole word like "hello," or a piece of a word like "happ" and "iness," or even a single character like "!" or a space.\n\nThe model has a fixed list of tokens it knows — its **vocabulary**. Every piece of text you give it gets split into tokens from that list. If a word isn't in the vocabulary as a whole piece, it gets broken into smaller chunks that are.\n\nThis tokenization step happens before anything else. When the model trains on its dataset — billions of sentences from books, websites, and articles — every single sentence gets broken into tokens first. That's how the model "reads" its training data.`,
        },
        3: {
          type: 'text',
          content: `Language models don't operate on raw text strings. Before any processing happens, text is **tokenized** — split into a sequence of tokens drawn from a fixed vocabulary.\n\nTokenization is the very first step in the pipeline:\n\n1. Raw text comes in: \`"Hello world"\`\n2. The tokenizer splits it: \`["Hello", " world"]\`\n3. Each token maps to an integer ID: \`[15496, 995]\`\n4. Those IDs are what the model actually processes\n\nNotice that " world" includes the leading space — that space is part of the token. Tokenizers are full of surprises like this. The way text gets split has real consequences for how the model "sees" language.`,
        },
        5: {
          type: 'text',
          content: `Tokenization is the interface between raw text and the discrete input space of the model. The tokenizer defines a bijective mapping between a vocabulary V = {v₁, ..., v_|V|} and the integers {0, ..., |V|-1}.\n\nModern LLMs overwhelmingly use **Byte-Pair Encoding (BPE)** or variants like SentencePiece's unigram model. BPE builds a vocabulary iteratively:\n\n1. Start with a base vocabulary of individual bytes (or characters)\n2. Count all adjacent token pairs in a training corpus\n3. Merge the most frequent pair into a new token\n4. Repeat until the vocabulary reaches the target size\n\nThis produces a vocabulary that balances granularity (individual characters) with efficiency (common words as single tokens). The merge order is deterministic, making tokenization reproducible.`,
        },
      },
      right: {
        1: { type: 'static', content: null },
        3: {
          type: 'code',
          code: `# Tokenization in action\ntext = "Hello world"\n\ntokens = tokenizer.encode(text)\n# tokens = [15496, 995]\n\ndecoded = tokenizer.decode(tokens)\n# decoded = "Hello world"\n\n# Each token has a string form:\n# 15496 → "Hello"\n# 995   → " world"`,
          annotations: { 0: 'Every model has a tokenizer', 3: 'Text → list of integer IDs', 6: 'IDs → back to text (lossless)', 9: 'The vocabulary maps IDs to strings' },
        },
        5: {
          type: 'code',
          code: `from transformers import AutoTokenizer\n\ntok = AutoTokenizer.from_pretrained("gpt2")\nids = tok.encode("Hello world")\nprint(ids)          # [15496, 995]\nprint(tok.vocab_size)  # 50257\n\n# Inspect individual tokens:\nfor id in ids:\n    print(f"{id} → {repr(tok.decode([id]))}")`,
          annotations: { 0: 'HuggingFace tokenizer', 3: 'Encode text to IDs', 5: 'GPT-2 has ~50k tokens in its vocab' },
        },
      },
    },
    {
      id: 'see-it-happen',
      heading: 'See it happen',
      left: {
        1: {
          type: 'text',
          content: `Let's watch tokenization happen in real time.\n\nType any sentence into the demo on the right. You'll see how the AI chops your words into tokens — and the results might surprise you.\n\nCommon words like "the" or "and" usually stay as one piece. But longer or unusual words get split into chunks. Try typing a made-up word like "flurbington" and see what happens — the AI has never seen that word before, so it has to break it into pieces it recognizes.\n\nNotice how each token gets its own color. Some words are one token. Some are two, three, or more.`,
        },
        2: {
          type: 'text',
          content: `Try the tokenizer on the right. Type in any text and watch how it gets broken apart.\n\nA few things to try:\n\n- **Common words** like "the" and "hello" — these are usually single tokens\n- **Longer words** like "understanding" — often split into "under" + "standing" or similar\n- **Numbers** — "12345" might become several tokens\n- **Other languages** — non-English text often requires more tokens per word\n- **Code** — programming syntax gets tokenized differently than prose\n\nThe number of tokens matters because models have a fixed **context window** — a maximum number of tokens they can handle at once.`,
        },
        3: {
          type: 'text',
          content: `Use the interactive tokenizer on the right to explore how text gets split.\n\nPay attention to token count. The same meaning can take different numbers of tokens:\n\n- "I do not know" → probably 4 tokens\n- "I don't know" → might be 4 or 5 (the apostrophe can cause a split)\n- "Idk" → might be 1 or 2\n\nThis has practical implications: models charge per token, and they have context length limits. A 4096-token context window means roughly 3000 English words — but far fewer words in some other languages, because those languages need more tokens per word.\n\n**Tokenization is not neutral.** The vocabulary is built from training data, so it reflects the biases of that data.`,
        },
      },
      right: {
        all: { type: 'interactive', component: 'TokenizerDemo' },
      },
    },
    {
      id: 'why-subwords',
      heading: 'Why subwords?',
      left: {
        1: {
          type: 'text',
          content: `Here's the puzzle: why not just make every word a token?\n\nBecause there are too many words. Think about it — every name, every place, every slang term, every misspelling, every word in every language. You'd need millions of tokens, and the model would barely see most of them during training.\n\nInstead, models use a clever trick: they learn common **pieces** of words. The word "unhappiness" might become ["un", "happi", "ness"]. The model has never seen "unhappiness" as a whole word, but it knows what "un" means, what "happi" looks like, and what "ness" does.\n\nIt's like knowing LEGO pieces. You've never built that exact house before, but you know what each brick does.`,
        },
        2: {
          type: 'text',
          content: `Why not just have one token per word? Two big problems:\n\n**Problem 1: Vocabulary explosion.** English alone has hundreds of thousands of words. Add names, technical terms, other languages, typos... a word-level vocabulary would be enormous and most entries would rarely appear.\n\n**Problem 2: Unknown words.** What happens when the model encounters a word it's never seen? With word-level tokens, it's stuck. It has no way to represent the word at all.\n\n**Subword tokenization** solves both problems. By breaking words into reusable pieces, the model can:\n- Keep a manageable vocabulary (30k–100k tokens)\n- Handle any text, even words it's never seen, by composing known pieces\n- Recognize patterns like prefixes ("un-", "re-") and suffixes ("-ing", "-tion")`,
        },
        3: {
          type: 'text',
          content: `Subword tokenization is a middle ground between character-level and word-level tokenization.\n\n**Character-level:** Every letter is a token. Tiny vocabulary, but sequences become extremely long. "Hello" = 5 tokens. The model has to learn spelling from scratch.\n\n**Word-level:** Every word is a token. Short sequences, but massive vocabulary with an out-of-vocabulary (OOV) problem for unseen words.\n\n**Subword-level (BPE):** Frequent words stay whole. Rare words get split into known pieces. "unhappiness" → ["un", "happi", "ness"]. The vocabulary stays manageable (30k–100k) while covering virtually any text.\n\nThe key insight: **common patterns should be single tokens for efficiency, while rare patterns can be composed from smaller pieces.** This is exactly what Byte-Pair Encoding achieves through its frequency-based merging process.`,
        },
        5: {
          type: 'text',
          content: `The choice of tokenization granularity presents a fundamental trade-off:\n\n**Compression ratio vs. vocabulary size.** Larger vocabularies compress text more (fewer tokens per sentence) but require larger embedding matrices (|V| × d parameters) and see each token less often during training.\n\nBPE optimizes for compression on the training corpus. The merge operations greedily minimize the sequence length by combining the most frequent adjacent pairs. This yields Zipfian vocabulary distributions where a small set of tokens covers the majority of text.\n\n**Morphological awareness** is a side effect, not a design goal. BPE sometimes discovers morpheme boundaries ("un" + "happi" + "ness") but just as often splits at arbitrary points. SentencePiece's unigram model and morphological tokenizers like Morfessor offer more principled approaches, but BPE dominates in practice due to simplicity and good empirical performance.\n\nNotably, tokenizer quality differs across languages. Languages well-represented in training data get better compression (fewer tokens per concept), creating an implicit efficiency bias.`,
        },
      },
      right: {
        1: { type: 'static', content: null },
        3: {
          type: 'code',
          code: `# Character-level (too granular)\n"cat" → ["c", "a", "t"]           # 3 tokens\n\n# Word-level (too coarse)\n"unhappiness" → [???]              # OOV!\n\n# Subword-level (just right)\n"unhappiness" → ["un", "happi", "ness"]  # 3 tokens\n"cat"         → ["cat"]                  # 1 token\n"cats"        → ["cat", "s"]             # 2 tokens`,
          annotations: { 0: 'Every character is a token — sequences get very long', 3: 'What if the word isn\'t in the dictionary?', 6: 'Common words stay whole, rare ones get split' },
        },
        5: {
          type: 'code',
          code: `# BPE merge algorithm (simplified)\ndef learn_bpe(corpus, num_merges):\n    vocab = list(set(characters(corpus)))\n    for i in range(num_merges):\n        pairs = count_adjacent_pairs(corpus)\n        best = max(pairs, key=pairs.get)\n        vocab.append(best[0] + best[1])\n        corpus = merge_pair(corpus, best)\n    return vocab\n\n# GPT-2: 50,257 merges from byte-level base\n# GPT-4: ~100k vocab (BPE on UTF-8 bytes)\n# LLaMA: 32,000 vocab (SentencePiece BPE)`,
          annotations: { 1: 'Start with individual characters', 3: 'Find the most common adjacent pair', 5: 'Create a new token from that pair', 6: 'Replace all occurrences in corpus' },
        },
      },
    },
    {
      id: 'token-ids',
      heading: 'Token IDs',
      left: {
        1: {
          type: 'text',
          content: `Here's something that might blow your mind: the AI never sees text at all. Not words. Not even tokens as letters. It only sees **numbers**.\n\nEvery token has an ID number — like an entry in a dictionary. "Hello" might be token #15496. "The" might be token #464. The sentence "The sky is blue" becomes something like [464, 6766, 318, 4171].\n\nThat's it. Those numbers are ALL the model gets. It does math on those numbers, and somehow, beautiful language comes out the other side.\n\nIt's like a musician who only sees sheet music as numbers but can still play a gorgeous symphony.`,
        },
        2: {
          type: 'text',
          content: `Every token in the vocabulary has a unique ID — a number. When text is tokenized, it becomes a list of these numbers.\n\n"Hello world" → tokens: ["Hello", " world"] → IDs: [15496, 995]\n\nThe model only works with these IDs. It never "reads" text. It receives a sequence of integers, processes them through layers of math, and outputs a new integer (which gets mapped back to a token, which becomes text).\n\nThis is why we say models see **numbers, not words**. The entire input to the model is a list of token IDs. The entire output is a probability distribution over those same IDs. Text is just the human-friendly interface on top.`,
        },
        3: {
          type: 'text',
          content: `Token IDs are indices into the vocabulary. If the vocabulary has 50,000 tokens, IDs range from 0 to 49,999.\n\nThe mapping is arbitrary — there's no meaning in the number itself. Token #15496 happens to be "Hello" in GPT-2's vocabulary, but that number doesn't encode any information about the word. It's just a lookup key.\n\nThe model's first step is to convert each token ID into a **vector** (a list of numbers) using an embedding table. This is where meaning starts to emerge — but that's the topic of a future lesson.\n\nFor now, the key point: the pipeline is always\n\ntext → tokens → IDs → embeddings → model → logits → probabilities → token ID → text`,
        },
        5: {
          type: 'text',
          content: `Token IDs are indices into the embedding matrix E ∈ ℝ^(|V| × d), where d is the model dimension. The lookup E[token_id] retrieves a dense vector representation.\n\nThis is implemented as a non-parameterized lookup (no gradients through the indexing operation), though the embedding vectors themselves are learned parameters. In PyTorch, \`nn.Embedding(vocab_size, d)\` stores the table.\n\nInterestingly, many architectures **tie** the input embedding matrix with the output projection (LM head): W_out = E^T. This halves the vocabulary-related parameters and provides a useful inductive bias — tokens that mean similar things should have similar embeddings AND similar output logits.\n\nThe full input representation typically adds positional information: x = E[token_id] + PE[position], where PE is either learned or sinusoidal.`,
        },
      },
      right: {
        1: { type: 'static', content: null },
        3: {
          type: 'code',
          code: `text = "The sky is blue"\n\n# Step 1: Tokenize\ntokens = ["The", " sky", " is", " blue"]\n\n# Step 2: Look up IDs\nids = [464, 6766, 318, 4171]\n\n# Step 3: Look up embeddings\n# Each ID → a vector of 768 numbers\n# [464]  → [0.012, -0.34, 0.78, ...]\n# [6766] → [-0.15, 0.22, 0.56, ...]\n\n# The model only sees the numbers`,
          annotations: { 0: 'Start with plain text', 3: 'Break into token strings', 6: 'Map each token to its ID', 9: 'Each ID becomes a rich number vector' },
        },
        5: {
          type: 'code',
          code: `import torch\nfrom transformers import AutoTokenizer, AutoModel\n\ntok = AutoTokenizer.from_pretrained("gpt2")\nmodel = AutoModel.from_pretrained("gpt2")\n\nids = tok.encode("The sky is blue")\nprint(ids)  # [464, 6766, 318, 4171]\n\n# Embedding lookup\ninput_ids = torch.tensor([ids])\nembeds = model.wte(input_ids)  # (1, 4, 768)\n\n# Weight tying: lm_head.weight == wte.weight\nprint(model.wte.weight.shape)  # (50257, 768)`,
          annotations: { 6: 'Text → integer IDs', 10: 'IDs → embedding vectors', 11: 'Each token becomes a 768-dim vector', 14: '50k tokens × 768 dimensions' },
        },
      },
    },
    {
      id: 'vocabulary',
      heading: 'Vocabulary',
      left: {
        1: {
          type: 'text',
          content: `The model's vocabulary is its complete list of tokens — every piece of text it can recognize. Think of it as the AI's dictionary, except instead of definitions, each entry is just a number.\n\nMost modern AI models have vocabularies of about 30,000 to 100,000 tokens. That might sound like a lot, but remember — these aren't just words. They include word pieces, punctuation, numbers, spaces, and tokens from many languages.\n\nHere's what's interesting: the vocabulary is **fixed** when the model is built. It never changes. The model can't learn new tokens after it's trained. If you invent a brand new word, the model has to spell it out using pieces it already knows.\n\nThat's why some words cost more tokens than others — the model handles "the" in one piece, but might need five pieces for your username.`,
        },
        2: {
          type: 'text',
          content: `A model's **vocabulary** is the fixed set of all tokens it knows. It's determined before training and never changes afterward.\n\nVocabulary size matters:\n\n- **Too small** (say, just 256 characters): Every word needs many tokens. "Hello" = 5 tokens. Processing is slow and the model struggles with long-range patterns.\n- **Too large** (say, every English word): The model needs a huge table to store them all, and rare words barely appear in training, so the model can't learn them well.\n- **Just right** (30k–100k subwords): Common words are single tokens for efficiency, rare words compose from known parts, and the table stays manageable.\n\nDifferent models have different vocabularies. GPT-2 has about 50,000 tokens. GPT-4 has about 100,000. LLaMA uses 32,000. The "best" size depends on the training data and target languages.`,
        },
        3: {
          type: 'text',
          content: `The vocabulary defines the model's "alphabet" — the set of atomic units it can read and produce. It's built once during a preprocessing step and frozen.\n\n**Vocabulary size trade-offs:**\n\n| Aspect | Small Vocab | Large Vocab |\n| Sequence length | Longer (more tokens per sentence) | Shorter (fewer tokens) |\n| Embedding table | Smaller (fewer parameters) | Larger |\n| Token frequency | Each token seen more often | Rare tokens under-trained |\n| Coverage | May need many tokens for rare words | Better single-token coverage |\n\nThe embedding table has shape (vocab_size × embedding_dim). For GPT-2: 50,257 × 768 = ~38.6M parameters — just for the token lookup table. This is a significant fraction of smaller models.\n\n**Practical implications:** Tokenizer choice affects model speed, multilingual performance, and even arithmetic ability (whether numbers are single tokens or split into digits).`,
        },
        5: {
          type: 'text',
          content: `The vocabulary size |V| is a critical hyperparameter that affects multiple system properties:\n\n**Parameter cost:** The embedding matrix E ∈ ℝ^(|V| × d) and the LM head W ∈ ℝ^(|V| × d) (or shared via tying) scale linearly with |V|. For |V| = 100k and d = 4096, each matrix is ~400M parameters.\n\n**Softmax cost:** Computing the output distribution requires a matrix multiply of shape (seq_len × d) @ (d × |V|), dominating compute for large vocabularies. Techniques like adaptive softmax and mixture-of-softmax address this.\n\n**Fertility (tokens per word):** Lower fertility means shorter sequences, reducing the quadratic cost of self-attention. Multilingual models face tension: more tokens for better per-language compression vs. total vocabulary budget.\n\n**Recent trends:** Larger vocabularies (100k+) with BPE on UTF-8 bytes (no unknown tokens possible). LLaMA-3 moved to 128k tokens. Some research explores dynamic vocabularies and byte-level models (ByT5) that eliminate tokenization entirely, trading vocabulary parameters for longer sequences.`,
        },
      },
      right: {
        1: { type: 'static', content: null },
        3: {
          type: 'code',
          code: `# Vocabulary sizes of popular models:\n# GPT-2:     50,257 tokens\n# GPT-4:    ~100,000 tokens\n# LLaMA-2:   32,000 tokens\n# LLaMA-3:  128,000 tokens\n\n# The embedding table:\nvocab_size = 50257\nembed_dim = 768\ntable_params = vocab_size * embed_dim\nprint(f"{table_params:,}")  # 38,597,376\n\n# That's 38.6 MILLION numbers\n# just to store the vocabulary!`,
          annotations: { 0: 'Different models, different vocab sizes', 7: 'GPT-2 dimensions', 10: 'Multiply to get parameter count' },
        },
        5: {
          type: 'code',
          code: `from transformers import AutoTokenizer\n\n# Compare tokenization across languages\ntok = AutoTokenizer.from_pretrained("gpt2")\n\ntexts = {\n    "English": "Hello, how are you?",\n    "Spanish": "Hola, ¿cómo estás?",\n    "Chinese": "你好，你好吗？",\n    "Arabic":  "مرحبا، كيف حالك؟",\n}\n\nfor lang, text in texts.items():\n    ids = tok.encode(text)\n    ratio = len(ids) / len(text.split())\n    print(f"{lang}: {len(ids)} tokens"\n          f" ({ratio:.1f} tokens/word)")`,
          annotations: { 3: 'GPT-2 was trained mostly on English', 12: 'Fertility: tokens per word', 13: 'English ≈ 1.3, Chinese ≈ 3+ tokens/word' },
        },
      },
    },
    {
      id: 'quiz',
      heading: null,
      left: {
        all: {
          type: 'quiz',
          question: 'Why do language models use subword tokens instead of whole words?',
          options: [
            'Subwords are easier for humans to read',
            'A subword vocabulary can handle any text while staying a manageable size',
            'Words are too short to be useful',
            'Subwords make the model run faster on GPUs',
          ],
          correct: 1,
          explanation: 'Subword tokenization is a practical compromise. A whole-word vocabulary would be enormous and couldn\'t handle new or rare words. Character-level tokenization creates very long sequences. Subwords keep the vocabulary manageable (30k–100k tokens) while being able to represent any text by composing known pieces.',
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
          content: `Now you know the AI's secret: it doesn't read words. It chops text into tokens, turns those tokens into numbers, and works with the numbers.\n\nBut here's the thing — those numbers are just IDs. Token #15496 doesn't mean anything by itself. The model still needs to learn that "happy" and "joyful" are related, that "bank" can mean a riverbank or a money bank, and that "not good" is the opposite of "good."\n\nHow does it learn any of that? It starts knowing nothing and has to figure everything out from scratch. Next lesson: **how a model learns from its mistakes**.`,
        },
        3: {
          type: 'text',
          content: `You've seen how text becomes tokens and tokens become IDs. But these IDs are arbitrary — the model starts with no understanding of what any token means or how tokens relate to each other.\n\nSo how does a model go from random numbers to generating coherent text? It has to **learn** — starting from complete randomness and gradually getting better by making predictions, checking how wrong it was, and adjusting.\n\nNext lesson: the learning process. We'll cover loss functions, gradient descent, and the training loop that turns a random number generator into a language model.`,
        },
        5: {
          type: 'text',
          content: `We've covered the tokenization pipeline — from raw text to integer IDs to embedding vectors. The model now has a sequence of dense vectors as input.\n\nBut the embedding matrix is initialized randomly. At the start of training, "happy" and "joyful" have completely unrelated representations. The model must learn meaningful embeddings through the training process itself.\n\nNext lesson: **Learning.** We'll examine how stochastic gradient descent on the cross-entropy loss reshapes these random vectors into a structured representation space — and how the training loop orchestrates forward passes, loss computation, backpropagation, and parameter updates.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
  ],
};
