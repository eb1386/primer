export default {
  slug: 'attention',
  title: 'Attention',
  sections: [
    {
      id: 'not-all-words',
      heading: 'Not all words matter equally',
      left: {
        1: {
          type: 'text',
          content: `Read this sentence: "The cat sat on the mat because it was tired."\n\nWhat does "it" refer to? The cat, obviously — not the mat. Your brain figured that out instantly.\n\nBut how? You looked back at the earlier words and decided that "cat" was more important than "mat" for understanding "it." You paid **attention** to "cat" and mostly ignored "the," "on," and "mat."\n\nAI does the same thing. When predicting or understanding each word, the model looks at all the other words and decides which ones matter most. It learned which words to pay attention to from its training data — by seeing millions of sentences with pronouns, it picked up on the patterns of what "it," "she," and "they" usually refer to.\n\nThis process is called **attention**, and it's the single most important idea in modern AI.`,
        },
        2: {
          type: 'text',
          content: `When a model processes a sentence, not every word is equally useful for understanding every other word.\n\nIn "The cat sat on the mat because it was tired," the word "it" needs to know about "cat" — but it doesn't care much about "the" or "on." Those words are grammatically necessary but don't help figure out what "it" means.\n\n**Attention** is the mechanism that handles this. For each word, the model computes a set of weights — scores that say "pay a lot of attention to this word, less to that word, almost none to this other word."\n\nThese weights add up to 1.0 (like a probability distribution), and the model uses them to build a context-aware representation of each word. The model learned these attention patterns from its training data — after seeing millions of sentences, it figured out which words tend to be important for understanding other words.`,
        },
        3: {
          type: 'text',
          content: `In a transformer, every token needs to "gather information" from the other tokens in the sequence. But not all tokens are equally relevant.\n\n**Attention** computes a weighted sum over all positions, where the weights are determined by how relevant each position is to the current one.\n\nFor each token, the model asks: "Which other tokens should I focus on?" It then assigns a weight to every other token — high weights for relevant tokens, low weights for irrelevant ones.\n\nThe output for each position is a weighted combination of information from all positions. This is what lets a transformer "understand" context: every token's representation gets enriched with information from the tokens that matter most.`,
        },
        4: {
          type: 'text',
          content: `Attention replaces recurrence (RNNs) and convolutions with a direct, position-independent mechanism for mixing information across the sequence.\n\nGiven a sequence of n token representations, attention computes an n × n matrix of pairwise relevance scores. Each row of this matrix is a probability distribution (via softmax) indicating how much each position contributes to the updated representation of the current position.\n\nKey advantages over RNNs:\n- **Constant path length**: any two tokens interact in O(1) layers, not O(n)\n- **Parallelizable**: all positions are computed simultaneously\n- **Interpretable**: attention weights can be visualized\n\nThis is why transformers can handle long-range dependencies that RNNs struggle with.`,
        },
        5: {
          type: 'text',
          content: `Self-attention (Vaswani et al., 2017) computes pairwise interactions between all positions in a sequence of length n, producing an n × n attention matrix.\n\nThe key insight: attention replaces the sequential information propagation of RNNs with an O(1) path length between any two positions. This solves the vanishing gradient problem for long-range dependencies, at the cost of O(n²) computation and memory.\n\nThis quadratic complexity is the primary bottleneck for long sequences. Various approximations exist:\n- **Sparse attention** (Child et al., 2019): attend to fixed patterns\n- **Linear attention** (Katharopoulos et al., 2020): kernel approximation, O(n)\n- **Flash Attention** (Dao et al., 2022): exact attention with IO-aware tiling, 2-4x speedup\n\nDespite the cost, the representational power of full attention remains unmatched for most tasks.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'your-intuition',
      heading: 'Your intuition',
      left: {
        1: {
          type: 'text',
          content: `Let's test your instincts. On the right, you'll see a sentence with one word highlighted. Your job: which other words in the sentence are most important for understanding that highlighted word?\n\nClick the words you think matter most. Don't overthink it — your gut feeling is usually right.\n\nFor example, if the highlighted word is "tired" in "The cat sat on the mat because it was tired," you'd probably click "cat" (who is tired?) and maybe "it" (connects back to what's tired).\n\nAfter you make your picks, we'll show you what the AI actually focuses on. You might be surprised how similar your intuition is to the model's attention.`,
        },
        3: {
          type: 'text',
          content: `Try highlighting different words and guessing which tokens the model attends to.\n\nSome patterns to look for:\n- **Pronouns** ("it", "she", "they") attend heavily to their referent — the noun they replace\n- **Verbs** attend to their subject and object\n- **Adjectives** attend to the noun they modify\n- **Punctuation** tokens often attend to structural elements\n\nYour predictions will likely match the model for clear cases (pronoun → noun). But the model sometimes attends to words you wouldn't expect — tokens that carry grammatical or positional information that isn't obvious to human readers.`,
        },
      },
      right: {
        all: { type: 'interactive', component: 'AttentionDemo' },
      },
    },
    {
      id: 'what-model-sees',
      heading: 'What the model sees',
      left: {
        1: {
          type: 'text',
          content: `Now let's reveal the model's attention. The brighter or thicker the connection between two words, the more attention the model is paying.\n\nSome things you might notice:\n\n**It makes sense.** The model connects "it" to "cat" in our example — just like you did.\n\n**Some surprises.** The model sometimes focuses on "boring" words like "the" or "." more than you'd expect. These words carry structural information that matters to the math even if they don't seem meaningful to us.\n\n**It changes per layer.** The model has many layers of attention, and different layers focus on different things. Early layers might focus on nearby words. Later layers pick up on meaning and relationships.`,
        },
        2: {
          type: 'text',
          content: `The attention weights reveal what the model "thinks" is relevant. Each word produces a distribution over all other words — the weights tell you where information flows.\n\nSome consistent patterns across most language models:\n\n- **Position bias**: tokens tend to attend to nearby tokens and to the first token in the sequence\n- **Semantic attention**: later layers attend based on meaning ("it" → "cat")\n- **Syntactic attention**: some heads track grammatical structure (verb → subject)\n- **Separator attention**: special tokens like [CLS] or [SEP] receive disproportionate attention\n\nImportant caveat: attention weights show where the model *looks*, but not necessarily what it *uses*. High attention doesn't always mean high importance for the final prediction.`,
        },
        3: {
          type: 'text',
          content: `Attention weights are the softmax-normalized scores that determine how much each token contributes to each other token's updated representation.\n\nFor token at position i, attention weight to position j:\n\nalpha_ij = softmax_j(score(i, j))\n\nThe output for position i is then:\n\noutput_i = Sigma_j alpha_ij * value_j\n\nVisualizing these weights reveals interpretable patterns, but be cautious: Jain & Wallace (2019) showed that attention weights don't always correlate with feature importance. A token can receive high attention but have little effect on the output if its value vector is nearly orthogonal to what the downstream computation needs.\n\nBetter interpretability tools include **attention rollout** (combining attention across layers) and **gradient-based attribution**.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'qkv',
      heading: 'Query, Key, Value',
      left: {
        1: {
          type: 'text',
          content: `So how does the model decide which words to pay attention to? It uses a clever system with three parts, each with an everyday analogy.\n\nImagine you're at a library:\n- You have a **question** in mind (this is the **Query**): "I need a book about cats."\n- Each book on the shelf has a **label** (this is the **Key**): "Animals," "Cooking," "History."\n- Each book contains actual **information** (this is the **Value**): the content inside.\n\nYou compare your question to every label. When you find a good match ("Animals" matches "cats"), you grab the information from that book.\n\nThe model does this for every word: it asks "what am I looking for?", checks all the labels, and collects the information from the best matches.`,
        },
        2: {
          type: 'text',
          content: `Every word in the sentence gets transformed into three different vectors:\n\n**Query (Q)**: "What am I looking for?" — represents what this word needs to know.\n\n**Key (K)**: "What do I contain?" — represents what this word can offer to others.\n\n**Value (V)**: "Here's my actual information." — the content that gets passed along.\n\nThe model compares each Query against every Key to get a score. High score means "this is relevant." The scores become weights (after softmax), and the final output is a weighted sum of the Values.\n\nEvery word simultaneously acts as a question-asker (via its Query) and an information-provider (via its Key and Value). That's what makes it **self-attention** — the sentence attends to itself.`,
        },
        3: {
          type: 'text',
          content: `Each token's embedding is projected through three learned weight matrices to produce Query, Key, and Value vectors:\n\nQ = X * W_Q\nK = X * W_K\nV = X * W_V\n\nwhere X is the input embedding and W_Q, W_K, W_V are in R^(d_model x d_k).\n\nThe attention score between positions i and j:\n\nscore(i, j) = Q_i * K_j / sqrt(d_k)\n\nThe sqrt(d_k) scaling prevents dot products from becoming too large (which would push softmax into regions with tiny gradients).\n\nAfter softmax, the output for position i:\n\noutput_i = Sigma_j softmax(score(i, j)) * V_j\n\nIn matrix form: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V`,
        },
        4: {
          type: 'text',
          content: `The scaled dot-product attention formula:\n\nAttention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V\n\nWhere Q, K, V in R^(n x d_k) are computed from the input X in R^(n x d_model):\n\nQ = XW_Q,  K = XW_K,  V = XW_V\n\nWhy three separate projections? If we used X directly (Q = K = V = X), the attention score x_i * x_j would just be a dot product of the raw embeddings — the model couldn't learn different notions of "what to look for" vs. "what to advertise" vs. "what to send."\n\nThe separate projections let the model learn that a token might *look for* verbs (via Q), *advertise itself* as a noun (via K), and *send* its semantic content (via V) — three different roles simultaneously.\n\nThe scaling factor 1/sqrt(d_k) keeps gradients stable. Without it, large d_k values make dot products grow proportionally, causing softmax to saturate.`,
        },
        5: {
          type: 'text',
          content: `Scaled dot-product attention:\n\nAttention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V\n\nwhere Q = XW_Q, K = XW_K, V = XW_V, and W_Q, W_K in R^(d_model x d_k), W_V in R^(d_model x d_v).\n\nThe scaling 1/sqrt(d_k) is derived from the assumption that Q and K elements are iid with zero mean and unit variance. Then E[q*k] = 0 and Var[q*k] = d_k, so dividing by sqrt(d_k) normalizes the variance to 1.\n\nFor causal (autoregressive) models, a mask M is applied before softmax:\n\nAttention = softmax(QK^T / sqrt(d_k) + M) V\n\nwhere M_ij = 0 if i >= j, else -inf. This ensures token i cannot attend to future tokens j > i.\n\nComputational cost: O(n^2 * d_k) for the QK^T multiplication, and O(n^2 * d_v) for the attention-weighted sum. Memory for the attention matrix is O(n^2), which FlashAttention (Dao et al., 2022) avoids by computing attention in tiles and never materializing the full matrix.`,
        },
      },
      right: {
        1: { type: 'static', content: null },
        2: { type: 'static', content: null },
        3: {
          type: 'code',
          code: `# Scaled dot-product attention
Q = X @ W_Q  # What am I looking for?
K = X @ W_K  # What do I contain?
V = X @ W_V  # What info do I carry?

scores = Q @ K.T / sqrt(d_k)  # Compare all pairs
weights = softmax(scores)      # Normalize to probabilities
output = weights @ V           # Weighted sum of values`,
          annotations: {
            1: 'Project each word into Query space',
            2: 'Project into Key space',
            3: 'Project into Value space',
            5: 'Dot product + scaling',
            6: 'Each row sums to 1.0',
            7: 'Gather relevant information',
          },
        },
        4: {
          type: 'code',
          code: `import numpy as np

def attention(X, W_Q, W_K, W_V):
    Q = X @ W_Q  # (n, d_k)
    K = X @ W_K  # (n, d_k)
    V = X @ W_V  # (n, d_v)

    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)  # (n, n)

    # Causal mask: prevent attending to future
    mask = np.triu(np.full_like(scores, -1e9), k=1)
    scores = scores + mask

    weights = softmax(scores, axis=-1)  # (n, n)
    return weights @ V                  # (n, d_v)`,
          annotations: {
            3: 'Three separate learned projections',
            8: 'Scaling prevents gradient vanishing in softmax',
            11: 'Upper triangle → -inf → softmax → 0',
            14: 'Each position gathers from allowed positions',
          },
        },
        5: {
          type: 'code',
          code: `import torch
import torch.nn.functional as F
import math

def scaled_dot_product_attention(Q, K, V, mask=None):
    """(batch, heads, seq_len, d_k) tensors"""
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)

    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))

    attn_weights = F.softmax(scores, dim=-1)
    attn_weights = F.dropout(attn_weights, p=0.1)

    return torch.matmul(attn_weights, V), attn_weights`,
          annotations: {
            4: 'Batched, multi-head compatible',
            6: 'QK^T / sqrt(d_k) — the core computation',
            9: 'Causal or padding mask',
            12: 'Attention dropout for regularization',
          },
        },
      },
    },
    {
      id: 'multiple-heads',
      heading: 'Multiple heads',
      left: {
        1: {
          type: 'text',
          content: `Here's the thing — one attention pattern isn't enough. When you read a sentence, you're simultaneously tracking many different relationships: Who did what? Where did it happen? When? What does "it" refer to?\n\nSo the model doesn't just use one set of attention. It uses many — running in parallel. These are called **attention heads**.\n\nEach head learns to focus on a different pattern:\n- One head might track pronouns and the nouns they refer to\n- Another head might connect verbs to their subjects\n- Another might focus on nearby words for local grammar\n\nA typical model might have 12 to 96 heads, all running at the same time, each seeing the sentence differently. Their results get combined into a single, rich understanding of each word.`,
        },
        2: {
          type: 'text',
          content: `A single attention head can only capture one type of relationship at a time. But language has many simultaneous structures — syntax, semantics, coreference, and more.\n\n**Multi-head attention** solves this by running several attention heads in parallel, each with its own Q, K, V projections. Each head independently decides what to focus on.\n\nAfter all heads compute their outputs, the results are concatenated and projected back to the original dimension:\n\nMultiHead = Concat(head_1, head_2, ..., head_h) * W_O\n\nIn practice:\n- GPT-2 (small): 12 heads\n- GPT-3: 96 heads\n- Each head operates on a slice of the embedding dimension (d_model / h per head)\n\nThis lets the model simultaneously track grammar, meaning, position, and more.`,
        },
        3: {
          type: 'text',
          content: `Multi-head attention runs h parallel attention operations, each with its own learned projections:\n\nhead_i = Attention(XW_Q^i, XW_K^i, XW_V^i)\n\nwhere W_Q^i, W_K^i are in R^(d_model x d_k) and d_k = d_model / h.\n\nThe outputs are concatenated and projected:\n\nMultiHead(X) = Concat(head_1, ..., head_h) * W_O\n\nwhere W_O is in R^(d_model x d_model).\n\nWhy split dimensions? If d_model = 768 and h = 12, each head works with 64-dimensional Q, K, V vectors. This is cheaper than running 12 full-sized attention operations, and it forces each head to specialize.\n\nResearchers have found heads that specialize in specific syntactic relations (subject-verb agreement, prepositional attachment) and semantic relations (coreference, entity tracking).`,
        },
        5: {
          type: 'text',
          content: `Multi-head attention:\n\nMultiHead(Q, K, V) = Concat(head_1, ..., head_h) W_O\nwhere head_i = Attention(QW_Q^i, KW_K^i, VW_V^i)\n\nParameter count for one MHA layer:\n- W_Q, W_K, W_V: 3 x d_model x d_model (often computed as one large projection W_QKV in R^(d_model x 3d_model))\n- W_O: d_model x d_model\n- Total: 4 x d_model^2 per layer\n\nFor GPT-3 (d_model=12288, 96 layers): 4 x 12288^2 x 96 ~ 58B parameters just for attention.\n\n**Grouped-Query Attention (GQA)** (Ainslie et al., 2023): reduces KV heads to save memory during inference. Instead of h KV heads, use g groups where g < h. Llama 2 70B uses GQA with 8 KV heads vs. 64 query heads.\n\n**Multi-Query Attention (MQA)** (Shazeer, 2019): extreme case where all heads share one K and one V projection. Reduces KV cache by h x, with minimal quality loss.`,
        },
      },
      right: {
        1: { type: 'static', content: null },
        3: {
          type: 'code',
          code: `class MultiHeadAttention:
    def __init__(self, d_model, num_heads):
        self.d_k = d_model // num_heads
        self.heads = [
            AttentionHead(d_model, self.d_k)
            for _ in range(num_heads)
        ]
        self.W_O = Linear(d_model, d_model)

    def forward(self, X):
        head_outputs = [h(X) for h in self.heads]
        concat = concatenate(head_outputs)
        return self.W_O(concat)`,
          annotations: {
            2: 'Each head gets a slice of the dimensions',
            4: 'Separate Q, K, V projections per head',
            10: 'Each head attends to different patterns',
            11: 'Combine all perspectives',
            12: 'Final projection merges everything',
          },
        },
        5: {
          type: 'code',
          code: `class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads, dropout=0.1):
        super().__init__()
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        self.W_qkv = nn.Linear(d_model, 3 * d_model)
        self.W_o = nn.Linear(d_model, d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, mask=None):
        B, T, C = x.shape
        qkv = self.W_qkv(x)  # (B, T, 3*C)
        qkv = qkv.reshape(B, T, 3, self.n_heads, self.d_k)
        qkv = qkv.permute(2, 0, 3, 1, 4)  # (3,B,h,T,d_k)
        Q, K, V = qkv.unbind(0)

        # Scaled dot-product attention
        attn = (Q @ K.transpose(-2,-1)) / math.sqrt(self.d_k)
        if mask is not None:
            attn = attn.masked_fill(mask == 0, -1e9)
        attn = self.dropout(F.softmax(attn, dim=-1))

        out = (attn @ V).transpose(1,2).reshape(B,T,C)
        return self.W_o(out)`,
          annotations: {
            5: 'Fused QKV projection — one matmul instead of three',
            13: 'Reshape for parallel head computation',
            18: 'Core attention: QK^T/sqrt(d_k)',
            22: 'Merge heads and project',
          },
        },
      },
    },
    {
      id: 'quiz',
      heading: null,
      left: {
        all: {
          type: 'quiz',
          question: 'In the attention mechanism, what do Query, Key, and Value represent?',
          options: [
            'Three different copies of the same word embedding',
            'Query = what a word is looking for, Key = what it offers, Value = the information it carries',
            'Query = the question, Key = the answer, Value = the score',
            'Three random projections used for regularization',
          ],
          correct: 1,
          explanation: 'Each word is projected into three roles: the Query represents what information the word is seeking, the Key represents what the word can offer to others, and the Value contains the actual information that gets passed along. The model compares Queries against Keys to compute attention weights, then uses those weights to gather Values.',
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
          content: `You've now learned the most important mechanism in modern AI: **attention** — how the model decides which words to focus on when processing each word.\n\nLet's take a step back and put it all together. You know that AI predicts the next word. You know it breaks text into tokens. You know it learns from mistakes. You know words become positions in space. And now you know the model can focus on what matters.\n\nIn the next lesson, we'll see how all of these pieces fit together into one complete system — the **transformer** — and understand the full journey from your typed text to the AI's response.`,
        },
        3: {
          type: 'text',
          content: `You now understand self-attention: how the model computes relevance scores between all pairs of tokens and uses them to build context-aware representations.\n\nBut attention is just one component of the transformer architecture. A full transformer block also includes:\n- **Layer normalization** — stabilizes training\n- **Feed-forward network** — processes each token independently after attention\n- **Residual connections** — allow gradients to flow through deep stacks\n\nIn the next lesson, we'll assemble the complete picture: how embeddings, attention, and feed-forward layers stack together to form the transformer — the architecture behind GPT, BERT, and every major language model.`,
        },
        5: {
          type: 'text',
          content: `You now have a detailed understanding of scaled dot-product attention and multi-head attention — the core mechanisms that give transformers their representational power.\n\nThe next lesson assembles the full transformer block: LayerNorm, MHA, residual, LayerNorm, FFN, residual. We'll examine why Pre-LN (GPT-2 style) outperforms Post-LN (original Vaswani) for deep models, the role of the feed-forward network as a key-value memory (Geva et al., 2021), and how residual streams create a "communication highway" across layers (Elhage et al., 2021). We'll trace a complete forward pass from raw text to predicted token.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
  ],
};
