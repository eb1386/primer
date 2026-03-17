export default {
  slug: 'embeddings',
  title: 'Embeddings',
  sections: [
    {
      id: 'words-as-points',
      heading: 'Words as points',
      left: {
        1: {
          type: 'text',
          content: `Picture a giant room. Now imagine every word you know is a dot somewhere in that room.\n\nThe word "dog" has its own spot. So does "cat" — and "cat" is placed right next to "dog" because they're both pets. Meanwhile, "airplane" is way across the room because it has nothing to do with pets.\n\nThis is the big idea behind **embeddings**: every word gets a position in space. Words that mean similar things end up near each other. Words that mean different things end up far apart.\n\nThe AI doesn't read words the way you do. It converts each word into a list of numbers — like GPS coordinates — that describe where that word lives in this imaginary space.`,
        },
        2: {
          type: 'text',
          content: `An **embedding** is a list of numbers that represents a word's position in a high-dimensional space.\n\nThink of it like coordinates on a map, but instead of two dimensions (north/south, east/west), embeddings might use hundreds of dimensions. Each dimension captures some aspect of what the word means.\n\nWords with similar meanings get similar coordinates:\n- "happy" and "joyful" → close together\n- "happy" and "concrete" → far apart\n\nThis is how AI models "understand" language — not by reading definitions, but by placing words in a space where proximity equals similarity.`,
        },
        3: {
          type: 'text',
          content: `An **embedding** maps each token in the vocabulary to a dense vector of real numbers, typically in ℝ^d where d ranges from 64 to 4096+.\n\nUnlike one-hot encodings (which are sparse and carry no semantic information), embeddings pack meaning into every dimension. The model learns to position words so that geometric relationships in the embedding space reflect semantic relationships in language.\n\nMechanically, the embedding layer is just a lookup table: given token ID \`i\`, return row \`i\` of a weight matrix W ∈ ℝ^(|V| × d).\n\n\`\`\`\nembedding("cat") → [0.21, -0.57, 0.83, ...]\nembedding("dog") → [0.24, -0.49, 0.79, ...]\n\`\`\`\n\nNotice how the vectors are similar — that's learned, not hardcoded.`,
        },
        4: {
          type: 'text',
          content: `Embeddings are dense, learned representations in ℝ^d. The embedding layer E ∈ ℝ^(|V| × d) maps discrete token IDs to continuous vectors.\n\nWhy not one-hot vectors? A one-hot vector for a 50k-word vocabulary would be 50,000-dimensional with a single 1. No two one-hot vectors are "closer" than any others — they all have the same distance. This makes them useless for capturing similarity.\n\nEmbeddings solve this by projecting into a much lower-dimensional space (d ≈ 256–4096) where geometry is meaningful. The **cosine similarity** between two embedding vectors measures their semantic relatedness:\n\nsim(a, b) = (a · b) / (‖a‖ · ‖b‖)\n\nValues near 1.0 mean the words are used in similar contexts. Values near 0 mean they're unrelated.`,
        },
        5: {
          type: 'text',
          content: `The embedding layer is a parameterized lookup E ∈ ℝ^(|V| × d_model). For a token with ID i, the embedding is simply E[i] — a row selection, equivalent to multiplying a one-hot vector by E.\n\nIn transformers, the input embedding is typically scaled by √d_model before adding positional encodings:\n\nx_t = E[token_t] · √d_model + PE(t)\n\nThe same weight matrix E is often **tied** with the output projection (LM head), meaning the logit for token w is computed as z_w = (E[w])ᵀ · h_final. This weight tying reduces parameters by |V| × d_model and acts as a regularizer — it forces the input and output representations to share the same geometric structure.\n\nThe distributional hypothesis (Harris, 1954; Firth, 1957) provides the theoretical foundation: "a word is characterized by the company it keeps."`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'see-the-space',
      heading: 'See the space',
      left: {
        1: {
          type: 'text',
          content: `On the right, you can see words plotted as dots in space. We've squished hundreds of dimensions down to just two so you can see the pattern.\n\nNotice how words cluster together:\n- Animals hang out near other animals\n- Colors group with colors\n- Numbers cluster with numbers\n\nThis isn't something anyone programmed. The AI figured out these groupings on its own, just by reading billions of sentences and learning which words appear in similar situations.\n\nTry hovering over the dots to see which words are which. Can you spot the clusters?`,
        },
        2: {
          type: 'text',
          content: `The visualization on the right shows word embeddings projected into 2D space. In reality, these vectors have hundreds of dimensions, but we use a technique called **dimensionality reduction** (like t-SNE or PCA) to squish them down so humans can see them.\n\nSome information gets lost in this projection — words that look close in 2D might actually be further apart in the full space, and vice versa. But the major clusters usually survive: you can still see that the model has learned to group similar words together.\n\nThis structure emerges entirely from training data. No one tells the model that "red" and "blue" are both colors — it discovers this from context.`,
        },
        3: {
          type: 'text',
          content: `We're using **PCA** (Principal Component Analysis) or **t-SNE** to project high-dimensional embeddings down to 2D for visualization.\n\nPCA finds the two directions of greatest variance in the data — it's a linear projection that preserves global structure but can miss local clusters.\n\nt-SNE optimizes a non-linear mapping that tries to keep nearby points together and push distant points apart. It's better for revealing clusters but can distort distances.\n\nIn the full embedding space, distances and directions are meaningful. For example, there might be a "gender" direction, a "tense" direction, or a "formality" direction — each captured by a combination of dimensions.`,
        },
      },
      right: {
        all: { type: 'interactive', component: 'EmbeddingDemo' },
      },
    },
    {
      id: 'similarity',
      heading: 'Similarity',
      left: {
        1: {
          type: 'text',
          content: `How does the AI know that "king" and "queen" are related? It's not because someone told it — it's because they're close together in embedding space.\n\n"King" and "queen" appear in similar sentences. "The king ruled the land." "The queen ruled the land." Because they can be swapped in so many sentences, the AI learns to put them near each other.\n\nMeanwhile, "king" and "banana" almost never appear in the same contexts, so they end up far apart.\n\nThis is the core insight: **meaning is captured by position**. You don't need a dictionary. You just need to know which words hang out together.`,
        },
        2: {
          type: 'text',
          content: `Two words are "similar" in embedding space if their vectors point in roughly the same direction. We measure this using **cosine similarity** — it's like checking the angle between two arrows.\n\n- Cosine similarity near **1.0**: very similar ("happy" and "glad")\n- Near **0**: unrelated ("happy" and "table")\n- Near **-1.0**: opposite meanings (rare in practice, but "hot" and "cold" might be somewhat negative)\n\nThe model learns these relationships from co-occurrence patterns. Words that appear in similar contexts get pulled toward similar positions during training.\n\nThis is why the model "knows" that cats and dogs are both animals, even though no one ever explicitly told it.`,
        },
        3: {
          type: 'text',
          content: `**Cosine similarity** measures the angle between two vectors:\n\nsim(a, b) = (a · b) / (‖a‖ · ‖b‖)\n\nwhere a · b is the dot product and ‖a‖ is the L2 norm.\n\nSome example similarity scores from real embeddings:\n- sim("king", "queen") ≈ 0.75\n- sim("king", "man") ≈ 0.62\n- sim("king", "potato") ≈ 0.12\n\nWhy cosine instead of Euclidean distance? Cosine ignores vector magnitude, focusing only on direction. Two vectors that point the same way are similar regardless of their length. This matters because during training, some word vectors can grow larger than others for reasons unrelated to meaning.`,
        },
        5: {
          type: 'text',
          content: `Formally, the embedding space induces a metric structure over the vocabulary. Cosine similarity is standard, though dot product similarity (without normalization) is used in attention computations.\n\nNearest-neighbor retrieval in embedding space is foundational to:\n- **Retrieval-Augmented Generation (RAG)**: embed queries and documents, retrieve by similarity\n- **Semantic search**: find documents by meaning, not keywords\n- **Clustering**: group semantically related tokens/documents\n\nFor efficient nearest-neighbor search over millions of vectors, approximate methods like HNSW (Hierarchical Navigable Small World) or IVF (Inverted File Index) are used, with libraries like FAISS.\n\nIsotropy (uniform distribution of embeddings across directions) is desirable but not always achieved — many embedding spaces exhibit anisotropy, where vectors cluster in a narrow cone.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
    {
      id: 'arithmetic',
      heading: 'Arithmetic',
      left: {
        1: {
          type: 'text',
          content: `Here's where things get wild. You can do **math with words**.\n\nTake the embedding for "king." Subtract the embedding for "man." Add the embedding for "woman." What do you get?\n\n**Queen.**\n\nIt's like the AI learned that "king" minus "man" equals "royalty" — and when you add "woman" back, you get the female version of royalty.\n\nThis works for other things too:\n- Paris - France + Italy ≈ Rome\n- Walking - walk + swim ≈ Swimming\n\nThe AI isn't doing word problems. It's doing math with positions in space — and the relationships between positions carry meaning.`,
        },
        2: {
          type: 'text',
          content: `One of the most surprising properties of embeddings is that **vector arithmetic captures analogies**.\n\nThe classic example: king - man + woman ≈ queen\n\nWhat's happening here? The vector from "man" to "king" represents the concept of "male royalty." When you apply that same offset starting from "woman," you land near "queen."\n\nThis suggests the embedding space has consistent **directions** that correspond to concepts:\n- There's a "gender" direction\n- There's a "royalty" direction\n- There's a "tense" direction (walk → walked, run → ran)\n\nThese directions aren't programmed — they emerge naturally from how words are used in text.`,
        },
        3: {
          type: 'text',
          content: `Word analogy via vector arithmetic:\n\nvec("king") - vec("man") + vec("woman") ≈ vec("queen")\n\nTo find the answer, we compute the target vector and search for the nearest word:\n\n\`\`\`\ntarget = embedding["king"] - embedding["man"] + embedding["woman"]\nresult = nearest_neighbor(target, vocabulary)\n# result ≈ "queen"\n\`\`\`\n\nThis works because the embedding space learns **linear substructures**. The direction from "man" to "woman" is approximately the same as the direction from "king" to "queen" — both capture gender.\n\nNot all analogies work perfectly. The method tends to do well with syntactic relationships (plurals, tenses) and common semantic relationships (capitals, genders), but struggles with more nuanced or context-dependent relationships.`,
        },
        5: {
          type: 'text',
          content: `The analogy task formalized by Mikolov et al. (2013): given a:b :: c:?, solve for d = argmax_w cos(w, b - a + c).\n\nThis linear structure arises because skip-gram and CBOW objectives implicitly factorize a co-occurrence PMI matrix (Levy & Goldberg, 2014). The resulting vectors encode log-bilinear relationships, and vector differences correspond to ratios of conditional probabilities.\n\nIn modern transformer embeddings, these relationships are less clean because the same word has different contextual embeddings depending on surrounding tokens. The "king - man + woman" demo uses static embeddings (Word2Vec/GloVe). In contextual models like BERT or GPT, the embedding layer alone doesn't capture these analogies — they emerge across layers.\n\nRecent work on **representation engineering** (Zou et al., 2023) finds linear directions in activation space that correspond to high-level concepts like truthfulness, fairness, and safety — extending the analogy idea to internal model representations.`,
        },
      },
      right: {
        1: { type: 'static', content: null },
        2: { type: 'static', content: null },
        3: {
          type: 'code',
          code: `# Word arithmetic with embeddings
target = emb["king"] - emb["man"] + emb["woman"]

# Find nearest word to target vector
similarities = {}
for word, vec in emb.items():
    similarities[word] = cosine_sim(target, vec)

result = max(similarities, key=similarities.get)
# result → "queen"`,
          annotations: {
            1: 'Vector subtraction and addition',
            4: 'Compare against every word',
            5: 'Cosine similarity measures closeness',
            7: 'Pick the word with highest similarity',
          },
        },
        4: {
          type: 'code',
          code: `import numpy as np

def analogy(a, b, c, embeddings, vocab):
    """Solve a:b :: c:? using vector arithmetic."""
    target = embeddings[b] - embeddings[a] + embeddings[c]

    # Cosine similarity against all words
    norms = np.linalg.norm(embeddings, axis=1)
    sims = (embeddings @ target) / (norms * np.linalg.norm(target))

    # Exclude input words
    for w in [a, b, c]:
        sims[vocab.index(w)] = -1

    return vocab[np.argmax(sims)]

# analogy("man", "king", "woman", E, V) → "queen"`,
          annotations: {
            3: 'Vector arithmetic encodes the relationship',
            6: 'Cosine similarity = dot product / norms',
            10: "Don't return input words",
          },
        },
        5: {
          type: 'code',
          code: `import torch
import torch.nn.functional as F

# Extract embedding matrix from a trained model
E = model.embedding.weight.detach()  # (vocab_size, d_model)

def analogy(a, b, c, E, tokenizer):
    ids = tokenizer.encode  # token → ID
    target = E[ids(b)] - E[ids(a)] + E[ids(c)]

    # Cosine similarity against full vocabulary
    sims = F.cosine_similarity(
        target.unsqueeze(0), E, dim=-1
    )

    # Mask out input tokens
    for tok in [a, b, c]:
        sims[ids(tok)] = -float('inf')

    return tokenizer.decode(sims.argmax().item())`,
          annotations: {
            3: 'Static embedding weights from the first layer',
            6: 'The core arithmetic: b - a + c',
            9: 'Broadcast comparison against all vocab vectors',
          },
        },
      },
    },
    {
      id: 'how-learned',
      heading: "How they're learned",
      left: {
        1: {
          type: 'text',
          content: `When a model first starts training, every word's position is completely random. "King" might be next to "pizza." "Cat" might be across the room from "kitten."\n\nBut as the model reads millions of sentences, it starts adjusting. Every time "cat" and "kitten" appear in similar sentences, the model nudges them a little closer together. Every time "cat" and "algebra" appear in different contexts, they drift apart.\n\nAfter reading billions of sentences, the random dots have rearranged themselves into a meaningful map — animals near animals, verbs near verbs, countries near countries.\n\nNobody designed this map. It emerged from patterns in language. The training data — billions of sentences from books, websites, and articles — is where all these patterns came from. By seeing millions of sentences where "cat" and "dog" appear in similar contexts ("the ___ sat on the mat," "I fed the ___"), the model learned to place them near each other.`,
        },
        2: {
          type: 'text',
          content: `Embeddings start as random numbers. During training, the model gradually adjusts them based on what it reads.\n\nThe key insight is the **distributional hypothesis**: words that appear in similar contexts have similar meanings. The model learns this from its training data — by seeing millions of sentences where "cat" and "dog" appear in similar contexts (after "I fed the," before "ran away," near "pet" and "vet"), it learns to place them close together. So their embeddings converge.\n\nEarly embedding methods like **Word2Vec** (2013) trained a small neural network specifically to learn embeddings. It would look at windows of text and learn to predict:\n- A word from its neighbors (CBOW)\n- Neighbors from a word (Skip-gram)\n\nModern models like GPT learn embeddings as part of the full language model — the embedding layer is trained end-to-end alongside everything else.`,
        },
        3: {
          type: 'text',
          content: `**Word2Vec** (Mikolov et al., 2013) was the breakthrough that made embeddings mainstream. Two architectures:\n\n**Skip-gram**: given a word, predict its surrounding words.\n**CBOW**: given surrounding words, predict the center word.\n\nThe training objective for skip-gram:\n\nmax Σ log P(context_word | center_word)\n\nwhere P is modeled using the dot product of embedding vectors passed through softmax.\n\n**GloVe** (Pennington et al., 2014) took a different approach: directly factorize the word co-occurrence matrix. The objective ensures that dot products of embeddings approximate the log of co-occurrence probabilities.\n\nIn modern transformers, the embedding matrix is initialized randomly (usually from a normal distribution with std ≈ 0.02) and trained via backpropagation along with all other parameters.`,
        },
        5: {
          type: 'text',
          content: `The skip-gram objective with negative sampling (SGNS):\n\nJ = Σ_{(w,c) ∈ D} [log σ(v_c · v_w) + Σ_{k=1}^{K} 𝔼_{c'~P_n} log σ(-v_{c'} · v_w)]\n\nwhere σ is sigmoid, v_w and v_c are word/context vectors, and P_n is the noise distribution (typically unigram^(3/4)).\n\nLevy & Goldberg (2014) showed SGNS implicitly factorizes the PMI matrix shifted by log(k):\n\nv_w · v_c = PMI(w,c) - log(k)\n\nIn transformers, the embedding layer E ∈ ℝ^(|V| × d) is initialized from N(0, 0.02) and trained with the full model. Unlike Word2Vec, transformer embeddings are **contextual** at deeper layers — the same word gets different representations depending on context. But the initial embedding layer is still a static lookup.\n\nRecent work on **Matryoshka Representation Learning** (Kusupati et al., 2022) trains embeddings where the first k dimensions form a valid (lower-quality) embedding, enabling adaptive-precision retrieval.`,
        },
      },
      right: {
        1: { type: 'static', content: null },
        3: {
          type: 'code',
          code: `# Word2Vec skip-gram (simplified)
for sentence in corpus:
    for i, word in enumerate(sentence):
        for j in context_window(i):
            context = sentence[j]
            # Push word and context closer
            loss = -log(sigmoid(
                dot(embed[word], embed[context])
            ))
            # Update embeddings via gradient
            embed[word]    -= lr * grad(loss)
            embed[context] -= lr * grad(loss)`,
          annotations: {
            2: 'For each word in the training data...',
            3: 'Look at nearby words',
            5: 'Dot product measures current similarity',
            9: 'Nudge embeddings to make co-occurring words closer',
          },
        },
        5: {
          type: 'code',
          code: `import torch
import torch.nn as nn

class EmbeddingLayer(nn.Module):
    def __init__(self, vocab_size, d_model):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, d_model)
        self.scale = d_model ** 0.5

    def forward(self, token_ids):
        return self.embed(token_ids) * self.scale

# In GPT-2: vocab_size=50257, d_model=768
# That's 50257 × 768 ≈ 38.6M parameters
# just for the embedding layer`,
          annotations: {
            5: 'Lookup table: ℝ^(|V| × d)',
            6: 'Scale factor √d_model (Vaswani et al.)',
            9: 'Simple row selection from weight matrix',
            12: '~38M learned parameters in embeddings alone',
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
          question: 'Why does "king - man + woman ≈ queen" work in embedding space?',
          options: [
            'Because someone programmed the relationship manually',
            'Because the vector differences capture consistent relationships like gender',
            'Because all word vectors have the same length',
            'Because queen is the most common word in the vocabulary',
          ],
          correct: 1,
          explanation: 'Embedding spaces learn consistent directions for concepts like gender, tense, and plurality. The vector from "man" to "king" captures the concept of "male royalty," and applying that same direction from "woman" lands near "queen." These relationships emerge from patterns in training data, not manual programming.',
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
          content: `You now know that AI turns every word into a list of numbers — a position in space — and that similar words end up in similar positions.\n\nBut here's a problem. When the model reads a sentence like "The bank of the river," it needs to know that "bank" means the edge of the water, not a place for money. The same word can mean different things depending on the words around it.\n\nHow does the model figure out which other words to pay attention to? That's exactly what the next lesson is about: **attention** — the mechanism that lets the model look at all the words in a sentence and decide which ones matter most.`,
        },
        3: {
          type: 'text',
          content: `You've learned that embeddings give each token a fixed vector based on its identity. But language is full of ambiguity — "bank" means something different in "river bank" vs. "bank account."\n\nStatic embeddings can't handle this. The model needs a way to adjust each word's representation based on the surrounding context.\n\nThat's what **attention** does. In the next lesson, we'll see how the model compares every word to every other word in a sentence, computing relevance scores that determine how information flows. Attention is the core mechanism that makes transformers work — and it's the reason modern AI can handle long, complex text.`,
        },
        5: {
          type: 'text',
          content: `Static embeddings provide a fixed point in ℝ^d for each token. But the same token needs different representations depending on context — polysemy, coreference, and compositional semantics all demand context-dependent representations.\n\nThe next lesson covers the **attention mechanism** — the core operation that transforms static token embeddings into contextualized representations. We'll derive the scaled dot-product attention formula Q·Kᵀ/√d_k, understand why multi-head attention is essential, and see how self-attention gives transformers their power: the ability to model arbitrary pairwise interactions across the full sequence length.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
  ],
};
