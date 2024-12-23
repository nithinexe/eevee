import { SolanaAgentKit, createSolanaTools } from 'solana-agent-kit';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MemorySaver } from '@langchain/langgraph';
// import * as dotenv from 'dotenv';
import { PublicKey } from '@solana/web3.js';

import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

// dotenv.config();

export async function initializeAgent() {
  const llm = new ChatOpenAI({
    modelName: 'gpt-4',
    temperature: 0.7,
  });

  const solanaKit = new SolanaAgentKit(
    process.env.SOLANA_PRIVATE_KEY!,
    process.env.RPC_URL,
    process.env.OPENAI_API_KEY!
  );



  const tools = createSolanaTools(solanaKit);
  const memory = new MemorySaver();

  return createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
  });
}
