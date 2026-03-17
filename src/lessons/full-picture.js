export default {
  slug: 'full-picture',
  title: 'The Full Picture',
  sections: [
    {
      id: 'assembly',
      heading: 'The assembly',
      left: {
        1: {
          type: 'text',
          content: `Every big idea you've learned so far — prediction, tokens, learning, embeddings, attention — is a building block. Alone, each one is pretty simple. Together, they form something remarkable.\n\nImagine building a tower out of LEGO. Each brick is just a brick. But when you stack them in the right order, you get a skyscraper.\n\nThat's exactly what a transformer is: all these simple ideas, stacked together in a specific way. The transformer processes the text you give it right now, but all its knowledge comes from the training data it read before — billions of sentences from books, websites, and more, compressed into its weights.\n\nYou already understand every piece. Now let's see how they fit.`,
        },
        2: {
          type: 'text',
          content: `You've now seen every core concept behind modern AI language models:\n\n- **Prediction**: guess the next word\n- **Tokens**: break text into pieces\n- **Learning**: adjust from mistakes\n- **Embeddings**: turn words into meaningful numbers\n- **Attention**: figure out which words matter for each other\n\nA transformer is what you get when you stack these ideas together into a single system. Each piece feeds into the next, forming a pipeline that turns raw text into predictions.`,
        },
        3: {
          type: 'text',
          content: `The **transformer** is the architecture behind GPT, BERT, LLaMA, and virtually every large language model. It was introduced in the 2017 paper "Attention Is All You Need."\n\nThe key insight: you don't need recurrence (RNNs) or convolution (CNNs) to process sequences. Self-attention alone, combined with a few other components, is sufficient — and it parallelizes beautifully.\n\nThe architecture is a pipeline:\n1. Tokenize input text\n2. Embed tokens into vectors\n3. Process through attention + feed-forward blocks (repeated N times)\n4. Project back to vocabulary for prediction`,
        },
        4: {
          type: 'text',
          content: `The transformer architecture consists of a stack of identical layers, each containing two sub-layers:\n\n1. **Multi-head self-attention** — allows each position to attend to all positions in the previous layer\n2. **Position-wise feed-forward network** — a two-layer MLP applied independently to each position\n\nEach sub-layer uses a **residual connection** and **layer normalization**:\n\noutput = LayerNorm(x + Sublayer(x))\n\nThe full decoder-only transformer (GPT-style) processes tokens autoregressively, using causal masking in the attention layer to prevent attending to future positions.`,
        },
        5: {
          type: 'text',
          content: `The transformer (Vaswani et al., 2017) replaced recurrent architectures with purely attention-based processing. The decoder-only variant (used in GPT) has become dominant for language modeling.\n\nArchitecturally:\n- Input: token IDs x ∈ ℤ^seq_len\n- Embedding: E(x) ∈ ℝ^(seq_len × d_model), combined with positional encoding\n- N identical layers, each: LayerNorm → Multi-Head Attention → LayerNorm → FFN\n- LM head: linear projection W ∈ ℝ^(d_model × |V|) mapping hidden states to logits\n\nModern variants (pre-norm, RMSNorm, RoPE, GQA, SwiGLU) refine these components but the fundamental data flow remains the same.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'flow',
      heading: 'The flow',
      left: {
        1: {
          type: 'text',
          content: `Watch the diagram on the right. Press "Play" and follow the dot as it moves through the transformer.\n\nData flows in one direction: top to bottom. Text goes in, gets transformed step by step, and a prediction comes out.\n\nYou can click on any stage to learn more about it. You can also use "Step" to move through one stage at a time.\n\nNotice how every stage you click connects back to something you've already learned. There's nothing new here — just a new way of combining familiar pieces.`,
        },
        2: {
          type: 'text',
          content: `The transformer processes data in a straight pipeline:\n\n1. Text comes in as a string\n2. Gets split into tokens\n3. Each token becomes a vector (embedding)\n4. Attention figures out relationships between tokens\n5. A feed-forward network processes each position\n6. Steps 4-5 repeat multiple times\n7. The final vectors are mapped back to word probabilities\n\nPress "Play" on the right to watch data flow through each stage. Click any stage for a description.`,
        },
        3: {
          type: 'text',
          content: `The forward pass through a transformer:\n\n1. **Tokenization**: text → token IDs\n2. **Embedding**: token IDs → dense vectors, plus positional encoding\n3. **Transformer blocks** (repeated N times):\n   - Self-attention: model relationships between positions\n   - Feed-forward: transform each position independently\n4. **Output projection**: final hidden states → logits over vocabulary\n\nEach block refines the representation. Early layers tend to capture syntax and local patterns. Later layers capture semantics and long-range dependencies.\n\nUse the interactive diagram to step through each stage.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'embedding-layer',
      heading: 'Embedding layer',
      left: {
        1: {
          type: 'text',
          content: `Remember embeddings? Words that mean similar things live close together in a giant number space.\n\nThe embedding layer is the transformer's front door. Every token that enters gets looked up in a big table and swapped for its vector of numbers.\n\nAfter this step, the transformer doesn't see words anymore. It sees patterns of numbers — and those patterns carry meaning. "King" and "queen" start out with similar numbers. "Cat" and "refrigerator" start far apart.\n\nThis is the foundation that everything else builds on.`,
        },
        3: {
          type: 'text',
          content: `The embedding layer maps each token ID to a learned vector:\n\nh₀ = Embedding(token_id) + PositionalEncoding(position)\n\nThe embedding matrix E ∈ ℝ^(|V| × d_model) is learned during training. Positional encoding adds information about where each token sits in the sequence — without it, the model couldn't distinguish "dog bites man" from "man bites dog."\n\nThe original transformer used sinusoidal positional encodings. Modern models often use learned positions or **Rotary Position Embeddings (RoPE)**.`,
        },
        5: {
          type: 'text',
          content: `Token embedding: E(x_t) = W_E[x_t] where W_E ∈ ℝ^(|V| × d_model)\n\nPositional encoding (sinusoidal):\nPE(pos, 2i) = sin(pos / 10000^(2i/d_model))\nPE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))\n\nThe input to the first transformer block: h⁰ = W_E[x] + PE\n\nRoPE (used in LLaMA, etc.) applies rotation matrices to Q and K in attention, encoding relative position directly in the dot product. This allows better length generalization than absolute positional encodings.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'attention-layer',
      heading: 'Attention layer',
      left: {
        1: {
          type: 'text',
          content: `Now comes the magic ingredient: attention.\n\nAfter embedding, every token knows about itself but nothing about its neighbors. The attention layer fixes this. Each token gets to "look around" at all the other tokens and figure out which ones are important.\n\nWhen the model reads "The cat sat on the mat because it was tired," the attention layer is how "it" figures out it's talking about the cat — not the mat.\n\nThis is the heart of the transformer. It's what makes these models so good at understanding language.`,
        },
        3: {
          type: 'text',
          content: `Self-attention computes a weighted sum of all positions for each position:\n\nAttention(Q, K, V) = softmax(QK^T / √d_k) V\n\nMulti-head attention runs this computation multiple times in parallel (typically 8-96 heads), each learning different relationship patterns:\n- Some heads learn syntactic dependencies\n- Some track coreference (pronouns → nouns)\n- Some capture semantic similarity\n\nAfter attention, a residual connection adds the original input back, and layer normalization stabilizes the values.`,
        },
        5: {
          type: 'text',
          content: `Multi-head attention with h heads:\n\nMultiHead(Q, K, V) = Concat(head₁, ..., headₕ) W^O\nwhere headᵢ = Attention(Q W^Q_i, K W^K_i, V W^V_i)\n\nProjection matrices: W^Q_i, W^K_i ∈ ℝ^(d_model × d_k), W^V_i ∈ ℝ^(d_model × d_v)\n\nCausal masking: set attention scores to -∞ for positions j > i, ensuring autoregressive property.\n\nGrouped-Query Attention (GQA): shares K, V heads across multiple Q heads, reducing KV-cache memory during inference. Used in LLaMA 2, Mistral, and most modern models.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'feed-forward',
      heading: 'Feed-forward layer',
      left: {
        1: {
          type: 'text',
          content: `After attention, each token knows about its neighbors. But it hasn't had time to "think" about what all that information means.\n\nThat's what the feed-forward layer does. Think of it as the "processing" step. Attention is "gathering information," and the feed-forward layer is "making sense of it."\n\nIt's like reading a sentence (attention) and then pausing to think about what it means (feed-forward). Each token processes its gathered information independently — kind of like everyone in a room thinking quietly after a group discussion.`,
        },
        2: {
          type: 'text',
          content: `The feed-forward layer is the transformer's "thinking" step.\n\nAfter attention has gathered relevant context from other words, the feed-forward network processes that information. It's a simple two-layer neural network applied to each token position independently.\n\nWhy is this needed? Attention is good at mixing information between positions, but it's linear — it can only do weighted averages. The feed-forward layer adds non-linearity, allowing the model to compute more complex functions of the attended information.`,
        },
        3: {
          type: 'text',
          content: `The position-wise feed-forward network (FFN) is applied independently to each position:\n\nFFN(x) = W₂ · ReLU(W₁ · x + b₁) + b₂\n\nwhere W₁ ∈ ℝ^(d_model × d_ff) and W₂ ∈ ℝ^(d_ff × d_model). Typically d_ff = 4 × d_model.\n\nThis is where much of the model's "knowledge" is stored. Research suggests that the FFN layers act as key-value memories, where the first layer's weights are keys and the second layer's weights are values.\n\nThe ReLU activation (or GELU/SiLU in modern models) introduces non-linearity.`,
        },
        5: {
          type: 'text',
          content: `Position-wise FFN:\nFFN(x) = W₂ σ(W₁ x + b₁) + b₂\n\nModern variants use gated architectures:\nSwiGLU(x) = (W₁ x ⊙ Swish(W_gate x)) W₂\n\nThis increases parameters but improves performance per FLOP.\n\nThe FFN layers contain the majority of a transformer's parameters. In GPT-3 (175B params), ~2/3 of parameters are in FFN layers.\n\nRecent work on "factual recall" shows FFN layers implement lookup: the first linear layer's rows act as "patterns" that match inputs, and the second layer's columns store the corresponding "outputs" — essentially a soft key-value store.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'stack-repeat',
      heading: 'Stack and repeat',
      left: {
        1: {
          type: 'text',
          content: `Here's a secret: the transformer doesn't do attention and thinking just once. It does it over and over, many times in a row.\n\nImagine re-reading a paragraph. The first time, you get the basic meaning. The second time, you notice connections you missed. The third time, you understand the deeper implications.\n\nThat's what stacking layers does. Each layer refines the model's understanding. Early layers catch simple patterns — like which words go together. Later layers grasp harder things — like sarcasm, logic, or what "it" refers to in a complex sentence.\n\nModern models stack 32, 64, even 96 layers deep.`,
        },
        3: {
          type: 'text',
          content: `A transformer block = self-attention + feed-forward + residual connections + layer norms.\n\nThis block is repeated N times (N = 12 for GPT-2 small, 96 for GPT-3).\n\nEach layer operates on the output of the previous layer, progressively refining the representations:\n- **Layer 1-4**: local syntax, word identity, basic patterns\n- **Layer 5-12**: semantic relationships, coreference, longer-range dependencies\n- **Later layers**: task-specific reasoning, factual recall, abstract relationships\n\nThe residual connections are critical: they allow gradients to flow directly through the network, making it possible to train very deep models.`,
        },
        5: {
          type: 'text',
          content: `For an N-layer transformer:\n\nh⁰ = Embed(x) + PE\nhˡ = TransformerBlock(hˡ⁻¹) for l = 1, ..., N\nlogits = hᴺ W_LM\n\nEach TransformerBlock:\nhˡ_attn = hˡ⁻¹ + MultiHeadAttention(LayerNorm(hˡ⁻¹))\nhˡ = hˡ_attn + FFN(LayerNorm(hˡ_attn))\n\nThis is "pre-norm" (used in GPT-2+). The original transformer used "post-norm" which is harder to train for deep models.\n\nScaling laws (Kaplan et al., Chinchilla): model performance scales predictably as a power law with parameters, compute, and data. Depth contributes more than width at fixed parameter count, but with diminishing returns.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'final-prediction',
      heading: 'Final prediction',
      left: {
        1: {
          type: 'text',
          content: `After all that processing — embedding, attention, thinking, repeating — the transformer has one final job: pick a word.\n\nThe numbers that come out of the last layer get converted back into scores for every word the model knows. The word with the highest score wins.\n\nAnd then? The model takes that word, adds it to the sentence, and does the whole thing again to pick the next word. And the next. And the next.\n\nThat's it. That's the entire process. From text to tokens to numbers to attention to prediction — one word at a time. And you now understand every step of it.`,
        },
        3: {
          type: 'text',
          content: `The final step: the output hidden state is projected back to vocabulary space.\n\nlogits = h_N · W_vocab\n\nWhere h_N is the last layer's output and W_vocab maps from d_model back to vocabulary size. These logits are passed through softmax to get probabilities, exactly as we saw in Lesson 1.\n\nMany models **tie** the output projection weights with the input embedding matrix (W_vocab = W_embed^T), which reduces parameters and often improves performance.\n\nThe predicted token is appended to the input, and the process repeats — autoregressive generation.`,
        },
        5: {
          type: 'text',
          content: `Output projection:\n\nlogits = LayerNorm(hᴺ) @ W_LM.T    (weight-tied with embedding matrix)\nP(xₜ₊₁ | x≤ₜ) = softmax(logits / T)\n\nDuring training, we minimize cross-entropy loss:\nL = -Σₜ log P(xₜ | x<ₜ)\n\nDuring inference, the KV-cache stores computed key/value tensors from previous positions, avoiding recomputation. This reduces generation from O(n²) to O(n) per token.\n\nSpeculative decoding: use a smaller "draft" model to propose tokens, then verify in parallel with the large model. This can provide 2-3x speedup without changing output distribution.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'quiz',
      heading: null,
      left: {
        all: {
          type: 'quiz',
          question: 'In a transformer, what happens right after the self-attention layer?',
          options: [
            'The output is sent directly to the next transformer block',
            'The information is processed through a feed-forward network',
            'The tokens are re-embedded from scratch',
            'The model makes its final prediction',
          ],
          correct: 1,
          explanation: 'After self-attention gathers context from other positions, a feed-forward network processes that information at each position independently. This attention + feed-forward pair forms one transformer block, which is then repeated multiple times.',
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'quiz-2',
      heading: null,
      left: {
        all: {
          type: 'quiz',
          question: 'In a transformer, what is the correct order of operations for processing input text?',
          options: [
            'Tokenize → Embed → Attention + Feed-Forward (repeated) → Predict',
            'Embed → Tokenize → Predict → Attention',
            'Attention → Embed → Tokenize → Feed-Forward',
            'Predict → Attention → Tokenize → Embed',
          ],
          correct: 0,
          explanation: 'Text is first tokenized into pieces, then each token is embedded into a vector. These vectors pass through multiple layers of attention and feed-forward processing, and finally the model predicts the next token.',
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'you-made-it',
      heading: 'You made it',
      left: {
        1: {
          type: 'text',
          content: `Congratulations. You now understand how AI language models work — from the ground up.\n\nLet's recap everything you've learned:\n\n**Prediction**: AI generates text by predicting the next word, one at a time.\n**Tokens**: Text gets broken into small pieces the model can handle.\n**Learning**: The model starts bad and gets better by adjusting itself based on its mistakes.\n**Embeddings**: Words become numbers that capture meaning — similar words get similar numbers.\n**Attention**: The model figures out which words are important for understanding each other.\n**The Full Picture**: All these pieces stack together into a transformer.\n\nThe next time someone talks about GPT, LLaMA, or any AI model — you'll know what's happening under the hood.`,
        },
        3: {
          type: 'text',
          content: `You've covered the core architecture of transformer-based language models:\n\n1. **Tokenization** — BPE/WordPiece converts text to subword token IDs\n2. **Embeddings** — token IDs map to dense vectors in a learned space\n3. **Self-Attention** — each position computes weighted sums over all positions\n4. **Feed-Forward Networks** — position-wise MLPs add non-linearity and store knowledge\n5. **Layer stacking** — repeated blocks refine representations\n6. **Autoregressive generation** — softmax over vocabulary, predict one token at a time\n\nThis is the architecture behind GPT-4, Claude, Gemini, LLaMA, Mistral, and every major LLM. The differences between models are mostly in scale, training data, and fine-tuning — the core mechanism is what you just learned.`,
        },
        5: {
          type: 'text',
          content: `You now understand the transformer architecture at a technical level:\n\n- Tokenization (BPE) → Embedding + positional encoding → N × (LayerNorm → Multi-Head Attention → LayerNorm → FFN) → LM Head → softmax\n- Training: minimize cross-entropy via backpropagation through the entire stack\n- Inference: autoregressive generation with KV-cache\n\nFrom here, the frontier:\n- **Scaling laws** and compute-optimal training\n- **RLHF/DPO** for alignment and instruction following\n- **Mixture of Experts (MoE)** for efficient scaling\n- **Long-context methods** (RoPE scaling, ring attention)\n- **Multimodal transformers** (vision encoders + LLM)\n- **Inference optimization** (quantization, distillation, speculative decoding)\n\nThe fundamentals you've learned are the foundation for all of it.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
  ],
};
