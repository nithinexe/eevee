// import { initializeAgent } from './agent';
// import { HumanMessage } from '@langchain/core/messages';

// async function runChat() {
//   const agent = await initializeAgent();
//   const config = { configurable: { thread_id: 'Solana Agent Kit!' } };

//   // Example: Send a command to the agent
//   const stream = await agent.stream(
//     {
//       messages: [new HumanMessage("Can you send 0.1 SOL to this address CztRNUjoAWDHpB1oNkGnQvry6SjAtoUR7hMSejDXV71i")],
//     },
//     config
//   );

//   // Handle the response
//   for await (const chunk of stream) {
//     if ('agent' in chunk) {
//       console.log(chunk.agent.messages[0].content);
//     } else if ('tools' in chunk) {
//       console.log(chunk.tools.messages[0].content);
//     }
//     console.log('-------------------');
//   }
// }

// runChat().catch(console.error);





import { initializeAgent } from './agent';
import { HumanMessage } from '@langchain/core/messages';
import * as readline from 'readline';
import * as dotenv from 'dotenv';

dotenv.config();

// Function to get user input from the command line
function getUserInput(query: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin as unknown as NodeJS.ReadableStream,
      output: process.stdout as unknown as NodeJS.WritableStream,
    });

  return new Promise((resolve) => {
    rl.question(query, (input) => {
      rl.close();
      resolve(input);
    });
  });
}

// Main function to run the interactive agent
async function runInteractiveAgent() {
  const agent = await initializeAgent();
  const config = { configurable: { thread_id: 'Solana Agent Kit!' } };

  console.log("Welcome to the Crypto DeFi Agent. You can ask me to perform various DeFi and crypto activities.");

  while (true) {
    const userCommand = await getUserInput('Enter your command (or type "exit" to quit): ');

    if (userCommand.toLowerCase() === 'exit') {
      console.log('Exiting the Crypto DeFi Agent. Goodbye!');
      break;
    }

    const promptTemplate = `You are a crypto agent specializing in DeFi and cryptocurrency activities. Your task is to: ${userCommand}`;

    const stream = await agent.stream(
      {
        messages: [new HumanMessage(promptTemplate)],
      },
      config
    );

    // Handle the response
    for await (const chunk of stream) {
      if ('agent' in chunk) {
        console.log('Agent:', chunk.agent.messages[0].content);
      } else if ('tools' in chunk) {
        console.log('Tools:', chunk.tools.messages[0].content);
      }
      console.log('-------------------');
    }
  }
}

runInteractiveAgent().catch(console.error);
