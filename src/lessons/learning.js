export default {
  slug: 'learning',
  title: 'Learning',
  sections: [
    {
      id: 'the-problem',
      heading: 'The problem',
      left: {
        1: {
          type: 'text',
          content: `When a brand new AI model is created, it knows absolutely nothing. Zero. It's like a baby — except worse, because a baby at least has instincts.\n\nThe model is just a big pile of numbers (called **weights**), and at the start, those numbers are completely random. Ask it to predict the next word in "The sky is ____" and it might say "banana" or "the" or "#@$!" — it has no idea.\n\nSo how does it go from knowing nothing to writing essays, answering questions, and generating code?\n\nIt **learns from its mistakes**. Over and over and over again. Billions of times. That's the entire secret.\n\nDuring training, the model reads through a massive dataset — billions of sentences from books, Wikipedia, websites, forums, and code repositories. It sees each sentence, tries to predict the next word, and adjusts when it's wrong. That's how it goes from clueless to capable.`,
        },
        2: {
          type: 'text',
          content: `A freshly created language model is useless. It contains millions (or billions) of numerical parameters called **weights**, and they're all initialized to random values.\n\nIf you give this random model a prompt like "The cat sat on the ____," it would predict the next word essentially at random — every word in its vocabulary has roughly equal probability.\n\nThe model needs to adjust its weights so that given "The cat sat on the," it assigns high probability to "mat" or "floor" and low probability to "democracy" or "penguin."\n\nTraining is the process of adjusting those weights. The model reads through a massive dataset — billions of sentences from books, Wikipedia, websites, forums, and code repositories. For each sentence, it tries to predict the next word, checks how wrong it was, and nudges its weights in a direction that would make that prediction a little less wrong. Then it does this again with the next sentence. And again. Millions of times.`,
        },
        3: {
          type: 'text',
          content: `At initialization, model weights are set to small random values (e.g., sampled from a normal distribution). The model's predictions are essentially random.\n\nThe goal of training is to find weight values that make the model assign high probabilities to actual text from a training corpus. If the training data contains "The cat sat on the mat," we want the model to learn that P("mat" | "The cat sat on the") should be high.\n\nThis is an **optimization problem**: we have a function (the model) with millions of adjustable parameters, and we need to find parameter values that minimize prediction errors across an entire dataset.\n\nThe key ingredients:\n1. A **loss function** that measures how wrong the model is\n2. An **algorithm** that tells us how to adjust weights to reduce the loss\n3. A **lot of data** to learn from`,
        },
        5: {
          type: 'text',
          content: `Model parameters θ are initialized from a distribution (typically Xavier/Glorot or Kaiming initialization, chosen to maintain activation variance across layers).\n\nAt init, the model approximates a uniform distribution over V: P(w | context; θ₀) ≈ 1/|V| for all w, giving initial loss ≈ log(|V|). For |V| = 50k, that's about 10.8 nats.\n\nTraining seeks θ* = argmin_θ E_{(x,y)~D} [L(f(x; θ), y)], where D is the data distribution, f is the model, and L is the loss function.\n\nThis is a non-convex optimization problem in extremely high-dimensional space (billions of dimensions). Despite the non-convexity, SGD and its variants find good solutions in practice — a phenomenon still not fully understood theoretically, though the lottery ticket hypothesis, loss landscape smoothness, and overparameterization arguments offer partial explanations.`,
        },
      },
      right: {
        1: { type: 'static', content: null },
        3: {
          type: 'code',
          code: `# A freshly initialized model\nimport torch\n\n# Random weights → random predictions\nmodel = RandomLanguageModel(vocab_size=50000)\n\ntext = "The cat sat on the"\nprobs = model.predict(text)\n\n# Every word gets ~equal probability:\n# P("mat")       ≈ 0.00002  (1/50000)\n# P("penguin")   ≈ 0.00002  (1/50000)\n# P("the")       ≈ 0.00002  (1/50000)\n\n# The model is just guessing randomly!`,
          annotations: { 3: 'All weights start as random numbers', 7: 'What does it predict?', 10: 'Everything is equally (un)likely' },
        },
        5: {
          type: 'code',
          code: `import torch.nn as nn\n\n# Xavier initialization (common default)\ndef init_weights(module):\n    if isinstance(module, nn.Linear):\n        nn.init.xavier_normal_(module.weight)\n        if module.bias is not None:\n            nn.init.zeros_(module.bias)\n    elif isinstance(module, nn.Embedding):\n        nn.init.normal_(module.weight, std=0.02)\n\nmodel.apply(init_weights)\n\n# Initial loss ≈ log(vocab_size)\nimport math\nprint(f"Expected initial loss: {math.log(50257):.2f}")\n# ≈ 10.82 nats`,
          annotations: { 2: 'Variance-preserving initialization', 4: 'Scale weights to keep gradients stable', 8: 'Embeddings: small random values', 13: 'Uniform random guessing = maximum loss' },
        },
      },
    },
    {
      id: 'loss',
      heading: 'Loss',
      left: {
        1: {
          type: 'text',
          content: `When you're learning to throw darts, you need to see how far you are from the bullseye. If you can't see the target, you can't improve.\n\nAI works the same way. After the model makes a guess, we need to measure **how wrong** it was. This measurement is called the **loss**.\n\n- Model predicts "banana" when the answer was "blue"? That's a **high loss** (very wrong).\n- Model predicts "blue" when the answer was "blue"? That's a **low loss** (nailed it).\n\nThe goal of training is simple: make the loss go down. Lower loss = better predictions. That's it. The entire training process is just the model trying to shrink its loss, one step at a time.\n\nWatch the error meter on the right — it shows how wrong the model is.`,
        },
        2: {
          type: 'text',
          content: `The **loss** is a number that tells us how wrong the model's prediction was. High loss means the model was way off. Low loss means it was close.\n\nHere's how it works in practice:\n\n1. The model sees: "The sky is ____"\n2. The correct answer is: "blue"\n3. The model assigns probabilities to every word\n4. If P("blue") = 0.01 (1% confidence) → high loss\n5. If P("blue") = 0.90 (90% confidence) → low loss\n\nThe loss tells the model not just that it was wrong, but **how wrong**. A model that gave "blue" a 40% chance did better than one that gave it a 1% chance, even though neither picked "blue" as their top guess.\n\nTraining is the process of adjusting the model's weights to make the loss smaller, one example at a time.`,
        },
        3: {
          type: 'text',
          content: `The standard loss function for language models is **cross-entropy loss** (also called negative log-likelihood).\n\nFor a single prediction:\n\nloss = -log(P(correct word))\n\nWhy log? Because it has nice properties:\n- If P(correct) = 1.0 → loss = 0 (perfect)\n- If P(correct) = 0.5 → loss = 0.69\n- If P(correct) = 0.01 → loss = 4.6 (very bad)\n- If P(correct) = 0.0001 → loss = 9.2 (terrible)\n\nThe negative log punishes confident wrong answers harshly. Assigning 0.01 to the right word is much worse than 0.1, even though both seem small.\n\nOver a training batch, we average the loss across all predictions. The optimizer's job is to minimize this average loss.`,
        },
        5: {
          type: 'text',
          content: `The cross-entropy loss for language modeling:\n\nL(θ) = -(1/T) Σₜ log P(xₜ | x<ₜ; θ)\n\nwhere T is the sequence length and P is the model's softmax output.\n\nThis is equivalent to the negative log-likelihood of the data under the model, and minimizing it is equivalent to minimizing KL(P_data || P_model).\n\n**Perplexity** = exp(L) is the standard evaluation metric. It represents the effective number of equally likely choices the model faces at each step. Random guessing on a 50k vocabulary gives perplexity 50,000. A well-trained model achieves perplexity ~20–30 on typical benchmarks.\n\nThe loss landscape in parameter space is highly non-convex with many saddle points and local minima. However, empirical evidence suggests that most local minima in overparameterized models achieve similar loss values — the challenge is navigating saddle points, not escaping local minima.`,
        },
      },
      right: {
        1: { type: 'static', content: null },
        2: { type: 'static', content: null },
        3: {
          type: 'code',
          code: `import math\n\n# Cross-entropy loss\ndef loss(prob_of_correct):\n    return -math.log(prob_of_correct)\n\n# Examples:\nprint(loss(0.90))   # 0.105  (good!)\nprint(loss(0.50))   # 0.693\nprint(loss(0.10))   # 2.303  (bad)\nprint(loss(0.01))   # 4.605  (terrible)\nprint(loss(0.001))  # 6.908  (awful)\n\n# Key insight: the penalty grows\n# FAST as confidence drops`,
          annotations: { 2: 'Negative log probability', 7: '90% confidence → tiny loss', 9: '10% → much bigger penalty', 11: '0.1% → enormous loss' },
        },
        5: {
          type: 'code',
          code: `import torch\nimport torch.nn.functional as F\n\n# Model outputs logits: (batch, seq_len, vocab)\nlogits = model(input_ids)  # (B, T, V)\n\n# Cross-entropy loss (PyTorch handles\n# softmax + neg log-likelihood internally)\nloss = F.cross_entropy(\n    logits.view(-1, vocab_size),  # (B*T, V)\n    targets.view(-1),             # (B*T,)\n    reduction='mean'\n)\n\n# Perplexity\nppl = torch.exp(loss)\nprint(f"Loss: {loss.item():.3f}")\nprint(f"Perplexity: {ppl.item():.1f}")`,
          annotations: { 4: 'Forward pass through the model', 8: 'PyTorch fuses softmax + log + nll', 9: 'Reshape to (total_predictions, vocab)', 10: 'Flatten target token IDs', 14: 'Perplexity = exp(loss)' },
        },
      },
    },
    {
      id: 'try-it-yourself',
      heading: 'Try it yourself',
      left: {
        1: {
          type: 'text',
          content: `Let's try something. Imagine you're standing on a hilly landscape in thick fog. You can't see more than a few feet. Your goal: find the lowest valley.\n\nWhat would you do? You'd feel the ground around you and take a step downhill. Then feel the ground again. Step downhill again. Eventually, you'd reach a low point.\n\nThat's exactly how the model learns! It can't see the whole landscape — it just checks which direction "downhill" is (which way reduces the loss) and takes a small step that way.\n\nThis process is called **gradient descent**. "Gradient" = which direction is downhill. "Descent" = walking that way.\n\nTry it yourself in the demo on the right. Drag the ball downhill and watch the loss decrease.`,
        },
        2: {
          type: 'text',
          content: `The model reduces its loss using a process called **gradient descent**. Here's the intuition:\n\nImagine the loss as a landscape — hills and valleys. The model's current weights put it at some point on this landscape. The **gradient** tells the model which direction is "uphill" — so the model walks in the opposite direction (downhill, toward lower loss).\n\nEach step:\n1. Compute the loss for a batch of examples\n2. Calculate the gradient (which direction increases the loss)\n3. Step in the opposite direction (to decrease the loss)\n4. Repeat\n\nThe model can't see the whole landscape. It's making local decisions — "from where I am right now, which direction should I step?" Over time, these small steps carry it to a region of low loss.\n\nTry it in the interactive demo on the right.`,
        },
        3: {
          type: 'text',
          content: `**Gradient descent** is the optimization algorithm that drives learning.\n\nThe gradient of the loss with respect to the weights, ∇L(θ), is a vector that points in the direction of steepest increase. To minimize the loss, we step in the opposite direction:\n\nθ_new = θ_old - learning_rate × ∇L(θ_old)\n\nIn practice, we use **stochastic gradient descent (SGD)**: instead of computing the gradient over the entire dataset (expensive), we estimate it from a small random **batch** of examples.\n\nThe gradient is computed via **backpropagation** — the chain rule applied systematically through the network's computational graph. This is remarkably efficient: computing gradients costs roughly 2–3x the cost of a forward pass.\n\nTry the interactive demo on the right to build intuition for how gradient steps find minima.`,
        },
        5: {
          type: 'text',
          content: `The gradient ∇_θ L is computed via reverse-mode automatic differentiation (backpropagation). For a computation graph with N operations, this requires O(N) time and memory — proportional to the forward pass.\n\nSGD update rule: θ ← θ - η ∇_θ L(θ; x_batch)\n\nwhere η is the learning rate. The stochastic gradient is an unbiased estimator of the true gradient: E[∇_θ L(θ; x_batch)] = ∇_θ E_{x~D}[L(θ; x)].\n\nVariance of the stochastic gradient decreases as O(1/batch_size). Larger batches give more stable gradients but fewer updates per compute-hour (the "linear scaling rule": scale η proportionally with batch size).\n\nModern optimizers like **Adam** maintain per-parameter adaptive learning rates using exponential moving averages of the gradient (first moment m) and squared gradient (second moment v):\n\nm ← β₁m + (1-β₁)g\nv ← β₂v + (1-β₂)g²\nθ ← θ - η × m̂ / (√v̂ + ε)`,
        },
      },
      right: {
        all: { type: 'interactive', component: 'GradientDescentDemo' },
      },
    },
    {
      id: 'what-the-computer-does',
      heading: 'What the computer does',
      left: {
        1: {
          type: 'text',
          content: `You just did gradient descent by hand — feeling which way is downhill and stepping that way.\n\nThe computer does the exact same thing, but automatically and incredibly fast. It:\n\n1. Shows the model some text (like "The cat sat on the")\n2. The model guesses the next word\n3. Checks the answer and measures the loss\n4. Figures out which direction to nudge each weight to make the loss smaller\n5. Nudges all the weights a tiny bit\n6. Goes back to step 1 with new text\n\nIt does this cycle thousands of times per second, with billions of weights being nudged simultaneously. After seeing enough examples, the weights settle into values that make good predictions.`,
        },
        3: {
          type: 'text',
          content: `The training loop has three phases per step:\n\n**Forward pass:** Feed input through the model, compute predicted probabilities, calculate loss.\n\n**Backward pass (backpropagation):** Compute the gradient of the loss with respect to every weight in the model. This uses the **chain rule** from calculus — each layer's gradient depends on the layers after it, so we work backwards from the loss.\n\n**Update:** Adjust each weight by a small amount in the direction that reduces the loss.\n\nFor a model with 175 billion parameters (like GPT-3), every single training step computes 175 billion gradients and makes 175 billion tiny adjustments. This happens thousands of times per second across thousands of GPUs.\n\nTypical training involves hundreds of billions of tokens — the model sees and learns from a significant fraction of the internet.`,
        },
        5: {
          type: 'text',
          content: `The computational cost of training scales as:\n\nC ≈ 6 × N × D (FLOPs)\n\nwhere N is parameter count and D is tokens processed (Chinchilla scaling). The factor of 6 comes from: 2x for forward pass multiply-adds, 2x for backward pass gradient computation, 2x for activation recomputation (gradient checkpointing).\n\nModern training distributes across thousands of accelerators using:\n- **Data parallelism:** Each device processes different batches; gradients are averaged\n- **Tensor parallelism:** Individual matrix multiplies are split across devices\n- **Pipeline parallelism:** Different layers run on different devices\n- **ZeRO/FSDP:** Optimizer states, gradients, and parameters are sharded\n\nLLaMA-2 70B required ~1.7M GPU-hours on A100s. GPT-4's training cost is estimated at $50–100M+ in compute.`,
        },
      },
      right: {
        1: { type: 'static', content: null },
        3: {
          type: 'code',
          code: `# The training loop (simplified)\nfor step in range(num_steps):\n    # 1. Get a batch of text\n    batch = get_random_batch(dataset)\n\n    # 2. Forward pass\n    predictions = model(batch.input)\n    loss = cross_entropy(predictions, batch.target)\n\n    # 3. Backward pass (backpropagation)\n    gradients = compute_gradients(loss, model)\n\n    # 4. Update weights\n    for param, grad in zip(model.params, gradients):\n        param -= learning_rate * grad\n\n    print(f"Step {step}: loss = {loss:.3f}")`,
          annotations: { 1: 'Repeat thousands/millions of times', 3: 'Random sample from training data', 6: 'Model makes predictions', 7: 'How wrong was it?', 9: 'Compute direction to improve', 12: 'Nudge every weight a tiny bit' },
        },
        5: {
          type: 'code',
          code: `optimizer = torch.optim.AdamW(\n    model.parameters(),\n    lr=3e-4,\n    betas=(0.9, 0.95),\n    weight_decay=0.1\n)\nscheduler = CosineAnnealingLR(optimizer, T_max=total_steps)\n\nfor step, batch in enumerate(dataloader):\n    # Forward\n    logits = model(batch['input_ids'])\n    loss = F.cross_entropy(\n        logits.view(-1, vocab_size),\n        batch['labels'].view(-1)\n    )\n\n    # Backward\n    loss.backward()  # computes all gradients\n\n    # Gradient clipping (prevents exploding gradients)\n    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)\n\n    # Update\n    optimizer.step()  # applies Adam update rule\n    scheduler.step()  # adjust learning rate\n    optimizer.zero_grad()  # reset gradients`,
          annotations: { 0: 'Adam with weight decay (standard for LLMs)', 6: 'Learning rate schedule: warm up then decay', 10: 'Forward pass', 17: 'Backprop: O(N) time and memory', 20: 'Clip to max norm 1.0 for stability', 23: 'Apply per-parameter adaptive updates' },
        },
      },
    },
    {
      id: 'learning-rate',
      heading: 'Learning rate',
      left: {
        1: {
          type: 'text',
          content: `Remember the downhill walk? There's one important detail: **how big are your steps?**\n\nIf you take tiny baby steps, you'll eventually reach the bottom — but it'll take forever. If you take huge leaping steps, you might jump right over the valley and end up on the other side, even higher up.\n\nThe step size is called the **learning rate**, and getting it right is crucial:\n\n- **Too small:** The model learns painfully slowly. It might take weeks instead of days.\n- **Too big:** The model overshoots, bouncing wildly. The loss goes up instead of down. It never settles.\n- **Just right:** The model steadily improves, getting a little better with each step.\n\nFinding the right learning rate is one of the trickiest parts of training AI models.`,
        },
        2: {
          type: 'text',
          content: `The **learning rate** controls how much the model adjusts its weights on each step. It's one of the most important settings in all of machine learning.\n\n**Think of it as a volume knob for learning:**\n\n- Turn it too low: The model barely changes. It learns, but agonizingly slowly. You waste compute.\n- Turn it too high: The model over-corrects. Each step is so large that it jumps past good solutions. The loss bounces around or even increases.\n- Sweet spot: Each step makes meaningful progress without overshooting.\n\nIn practice, researchers often start with a medium learning rate, gradually increase it during a "warm-up" phase, then slowly decrease it over training. This schedule helps the model explore broadly at first and then fine-tune as it gets closer to good weights.`,
        },
        3: {
          type: 'text',
          content: `The learning rate η (eta) multiplies the gradient in the update rule:\n\nθ_new = θ_old - η × ∇L(θ_old)\n\n**Too large:** Steps overshoot minima. In the worst case, the loss diverges to infinity (the gradients explode).\n\n**Too small:** Convergence is slow, and the optimizer may get stuck in shallow local minima or saddle points instead of finding deeper, better minima.\n\nTypical learning rates for transformer language models: 1e-4 to 1e-3 (0.0001 to 0.001).\n\n**Learning rate schedules** are standard practice:\n- **Warmup:** Start at near-zero, linearly increase over the first few thousand steps. This prevents early instability when gradients are large and noisy.\n- **Decay:** After warmup, gradually decrease the LR. Cosine decay is most popular: η(t) = η_min + 0.5(η_max - η_min)(1 + cos(πt/T))`,
        },
        5: {
          type: 'text',
          content: `The learning rate is arguably the most important hyperparameter. For Adam-family optimizers, the "effective" learning rate for each parameter is η / (√v̂ + ε), making the optimizer less sensitive to the global η than vanilla SGD.\n\nKey considerations:\n\n**Scaling with batch size:** The linear scaling rule (Goyal et al., 2017) suggests η ∝ batch_size. With gradient accumulation simulating large batches, this becomes critical.\n\n**Warmup:** Necessary for transformers because early gradients are dominated by random correlations. Without warmup, large initial updates can corrupt the residual stream, and the model never recovers.\n\n**Decay:** Cosine annealing to ~10% of peak LR is standard. Some evidence suggests that the final LR matters more than the decay shape (Chinchilla, LLaMA).\n\n**Learning rate as implicit regularization:** Larger LR introduces more SGD noise (proportional to η²/B), which acts as regularization by favoring flat minima. This connects to the generalization properties of solutions found by SGD.`,
        },
      },
      right: {
        1: { type: 'static', content: null },
        3: {
          type: 'code',
          code: `learning_rate = 0.001  # typical starting point\n\n# Update rule:\nweight = weight - learning_rate * gradient\n\n# Too big:\nlr = 1.0\n# weight bounces wildly, loss INCREASES\n\n# Too small:\nlr = 0.0000001\n# weight barely changes, training takes forever\n\n# Learning rate schedule:\n# Step 0-2000:    warmup  (0 → 0.001)\n# Step 2000-100k: decay   (0.001 → 0.0001)`,
          annotations: { 0: 'This single number controls training speed', 3: 'The core update rule', 6: 'Steps are too large — overshoot', 10: 'Steps are too small — waste time', 13: 'Start gentle, peak, then taper off' },
        },
        5: {
          type: 'code',
          code: `# Cosine learning rate schedule with warmup\ndef get_lr(step, warmup_steps, total_steps,\n          max_lr=3e-4, min_lr=3e-5):\n    if step < warmup_steps:\n        return max_lr * step / warmup_steps\n    progress = (step - warmup_steps) / (\n        total_steps - warmup_steps)\n    return min_lr + 0.5 * (max_lr - min_lr) * (\n        1 + math.cos(math.pi * progress))\n\n# LLaMA-style config:\n# warmup: 2000 steps\n# peak lr: 3e-4\n# min lr: 3e-5 (10% of peak)\n# total: ~1M steps\n# batch: 4M tokens\n# optimizer: AdamW(β1=0.9, β2=0.95, wd=0.1)`,
          annotations: { 0: 'Standard schedule for modern LLMs', 3: 'Linear warmup from 0 to max', 5: 'Cosine decay after warmup', 11: 'Typical hyperparameters from LLaMA paper' },
        },
      },
    },
    {
      id: 'putting-it-together',
      heading: 'Putting it together',
      left: {
        1: {
          type: 'text',
          content: `Let's zoom out and see the full picture of how a model learns.\n\n1. **Start with random weights** — the model knows nothing\n2. **Show it some text** — like a sentence from a book or website\n3. **It guesses the next word** — badly, at first\n4. **Measure the loss** — how wrong was it?\n5. **Figure out which way to adjust** — gradient descent tells us the direction\n6. **Nudge the weights** — make them a tiny bit better\n7. **Repeat** — millions and millions of times\n\nEach time through this loop, the model gets slightly better at predicting words. After seeing billions of sentences, those random weights have been shaped into something that can write poetry, answer questions, and explain quantum physics.\n\nAn important thing to understand: the "training data" isn't a database the model searches through later. The model reads through it during training and compresses the patterns into its weights. After training, it doesn't look anything up — it generates from what it learned, kind of like how you don't re-read a textbook during an exam.\n\nThe model never "understands" anything the way you do. But its predictions get so good that it's hard to tell the difference.`,
        },
        2: {
          type: 'text',
          content: `Here's the complete training process:\n\n**The training loop:**\n1. Start with randomly initialized weights\n2. Sample a batch of text from the training data\n3. Run the forward pass: text → tokens → model → predictions\n4. Calculate the loss: how wrong were the predictions?\n5. Run backpropagation: compute gradients for every weight\n6. Update weights: step in the direction that reduces loss\n7. Adjust the learning rate (schedule)\n8. Go back to step 2\n\nThis loop runs for days, weeks, or months on hundreds or thousands of GPUs.\n\n**The result:** Weights that started as random noise have been carefully sculpted by trillions of gradient updates into a system that can predict language with remarkable accuracy. The model has learned grammar, facts, reasoning patterns, coding syntax — all from the simple objective of predicting the next word.\n\nIt's worth noting that the training data isn't a database the model searches after training. The model reads through it once (or a few times), compresses the patterns into its weights, and that's it. When it generates text later, it's drawing on those learned patterns — not looking anything up.`,
        },
        3: {
          type: 'text',
          content: `The training loop ties together every concept from this lesson:\n\n**Forward pass:** input → tokenize → embed → model layers → logits → softmax → probabilities\n\n**Loss computation:** cross_entropy(predicted_probs, actual_next_token)\n\n**Backward pass:** backpropagation computes ∂loss/∂weight for every parameter\n\n**Update:** optimizer adjusts weights using gradients + learning rate\n\nThe number of times through this loop is staggering. GPT-3 was trained on 300 billion tokens. LLaMA-2 saw 2 trillion tokens. At each token, the model computed a loss, propagated gradients through billions of parameters, and made a tiny update.\n\nAfter enough iterations, the loss converges — it stops decreasing meaningfully. The model has learned what it can from the data. At that point, training stops, and the final weights are saved. Those frozen weights are the "model" that gets deployed.`,
        },
        5: {
          type: 'text',
          content: `The training loop for modern LLMs integrates several systems:\n\n**Data pipeline:** Streaming tokenized data from sharded files, with curriculum (e.g., upweighting high-quality sources in later training). Deduplication, quality filtering, and data mixing ratios are critical and often under-discussed.\n\n**Mixed precision:** Forward pass in bf16/fp16, loss scaling to prevent underflow, master weights in fp32 for stable accumulation. This halves memory and doubles throughput.\n\n**Gradient accumulation:** Simulate large batch sizes across multiple forward/backward passes before updating. Essential for memory-constrained setups.\n\n**Checkpointing and fault tolerance:** Training runs spanning weeks on thousands of GPUs will experience hardware failures. Periodic checkpointing (every few hundred steps) and automatic restart from the latest checkpoint are essential infrastructure.\n\n**Scaling laws** (Kaplan et al., Hoffmann et al.) predict final loss as a function of compute, parameters, and data: L(C) ≈ (C₀/C)^α. This allows researchers to extrapolate performance before committing to expensive full-scale training runs.`,
        },
      },
      right: {
        1: { type: 'static', content: null },
        3: {
          type: 'code',
          code: `# The complete training loop\nfor epoch in range(num_epochs):\n  for batch in dataloader:\n    # Forward pass\n    logits = model(batch.input_ids)\n    loss = cross_entropy(logits, batch.labels)\n\n    # Backward pass\n    loss.backward()\n\n    # Update\n    optimizer.step()\n    optimizer.zero_grad()\n\n    # Monitor\n    if step % 100 == 0:\n        print(f"Loss: {loss:.3f}")  \n\n# After billions of tokens:\n# Loss: 10.8 → 3.2 → 2.8 → 2.5 → ...`,
          annotations: { 1: 'Multiple passes through the data', 4: 'Text → predictions', 5: 'How wrong was the model?', 8: 'Compute gradients via chain rule', 11: 'Nudge all weights', 18: 'Loss steadily decreases over training' },
        },
        5: {
          type: 'code',
          code: `# Full training setup (LLaMA-style)\nmodel = TransformerLM(\n    vocab_size=32000, d_model=4096,\n    n_layers=32, n_heads=32\n)  # ~7B parameters\n\noptimizer = AdamW(model.parameters(),\n    lr=3e-4, betas=(0.9, 0.95), wd=0.1)\n\nscaler = GradScaler()  # mixed precision\n\nfor step, batch in enumerate(dataloader):\n    with autocast(dtype=torch.bfloat16):\n        logits = model(batch['input_ids'])\n        loss = F.cross_entropy(\n            logits.view(-1, 32000),\n            batch['labels'].view(-1))\n\n    scaler.scale(loss).backward()\n    scaler.unscale_(optimizer)\n    clip_grad_norm_(model.parameters(), 1.0)\n    scaler.step(optimizer)\n    scaler.update()\n    optimizer.zero_grad()\n    adjust_lr(optimizer, step)  # cosine schedule`,
          annotations: { 1: 'Standard transformer architecture', 4: 'LLaMA-2 7B config', 9: 'fp16/bf16 for 2x throughput', 12: 'bf16 forward pass', 18: 'Scale loss for fp16 stability', 20: 'Gradient clipping for training stability' },
        },
      },
    },
    {
      id: 'quiz',
      heading: null,
      left: {
        all: {
          type: 'quiz',
          question: 'What happens if the learning rate is too high during training?',
          options: [
            'The model learns faster and achieves better results',
            'The model overshoots good solutions and the loss may increase instead of decrease',
            'The model runs out of memory',
            'The model stops learning new words',
          ],
          correct: 1,
          explanation: 'A learning rate that\'s too high causes the model to take steps that are too large. Instead of smoothly descending toward low loss, it overshoots, bouncing past the good solutions. In extreme cases, the loss explodes to infinity. The learning rate controls step size — too big and you overshoot, too small and you waste time.',
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
          content: `You now know how a model starts from nothing and learns to predict words. It makes guesses, measures how wrong it was, figures out which direction to nudge its weights, and repeats this billions of times.\n\nBut there's a mystery we skipped over. The model turns every token into a list of numbers — an **embedding**. At first, these numbers are random. But during training, something magical happens: words with similar meanings end up with similar numbers.\n\n"King" and "queen" become close together. "Dog" and "puppy" become neighbors. The model discovers meaning just by trying to predict the next word.\n\nNext lesson: **Embeddings** — how numbers capture meaning.`,
        },
        3: {
          type: 'text',
          content: `You've learned the core training loop: forward pass, loss, backpropagation, weight update. This same loop, at massive scale, produces every language model in existence.\n\nBut we glossed over something important. When token IDs enter the model, they first become **embedding vectors** — dense numerical representations. These embeddings are learned parameters, shaped by the same gradient descent process we just covered.\n\nThe remarkable outcome: after training, embedding space develops geometric structure. Semantically similar tokens cluster together. Analogies emerge as vector arithmetic: vec("king") - vec("man") + vec("woman") ≈ vec("queen").\n\nNext lesson: **Embeddings** — how meaning emerges in vector space.`,
        },
        5: {
          type: 'text',
          content: `You now understand the optimization framework: cross-entropy loss, SGD/Adam, learning rate schedules, and the training loop infrastructure.\n\nThe next lesson examines what the optimization process actually discovers. The embedding layer E ∈ ℝ^(|V| × d) starts random, but gradient descent sculpts it into a structured space where geometric relationships encode semantic ones.\n\nWe'll explore the geometry of embedding spaces, distributional semantics, and how unsupervised next-token prediction gives rise to representations that transfer to downstream tasks — the foundation of the "pretrain then fine-tune" paradigm.`,
        },
      },
      right: {
        all: { type: 'static', content: null },
      },
    },
  ],
};
