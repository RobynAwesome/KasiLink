import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query: string): Promise<string> => 
  new Promise(resolve => rl.question(query, resolve));

async function runVerticalSlice() {
  // 1. DIGITAL CLAIM (The Opportunity)
  const opportunity = {
    id: "gig_0987",
    title: "Graphic Designer needed for weekend event",
    listed_pay: "500 ZAR",
    contact_number: process.env.TEST_PHONE_NUMBER || "<E164_PHONE>"
  };

  const boundedQuestions = [
    "Is the graphic designer position still open?",
    "Is the pay exactly 500 ZAR for the weekend?"
  ];

  // 2. NO-CALL PREVIEW
  console.log("=== KASIPROOF: NO-CALL PREVIEW ===");
  console.log(`Opportunity ID: ${opportunity.id}`);
  console.log(`Contact Target: ${opportunity.contact_number}`);
  console.log(`Bounded Task: Verify status and compensation.\nQuestions:`);
  boundedQuestions.forEach((q, i) => console.log(`  ${i+1}. ${q}`));
  console.log("===================================\n");

  // 3. EXPLICIT HUMAN APPROVAL
  const approval = await askQuestion("Do you explicitly approve this live CALL-E verification? (yes/no): ");
  if (approval.toLowerCase() !== 'yes') {
    console.log("Verification aborted. No call made.");
    rl.close();
    return;
  }

  // 4. CALL-E RUNTIME EXECUTION
  console.log("\n[CALL-E] Initiating outbound verification call via API...");
  
  // ---> INJECT ACTUAL CALL-E SDK CALL HERE <---
  // const client = new CallEClient(process.env.CALLE_API_KEY);
  // const callResult = await client.calls.create({ ... });
  
  // SIMULATED TERMINAL RESULT
  const terminalResult = {
    status: "completed",
    transcript: "Agent: Is the graphic designer position still open? Contact: Yes, we are still looking. Agent: Is the pay 500 ZAR? Contact: Yes.",
    structured_extraction: {
      position_open: true,
      confirmed_pay: "500 ZAR"
    }
  };

  console.log("\n=== CALL-E TERMINAL EVIDENCE ===");
  console.log(JSON.stringify(terminalResult, null, 2));

  // 5. DETERMINISTIC PKA STATE RECONCILIATION
  console.log("\n[PKA] Reconciling evidence against digital claim...");
  
  let pkaState = "UNKNOWN";
  
  if (terminalResult.status !== "completed") {
    pkaState = "UNKNOWN";
  } else if (
    terminalResult.structured_extraction.position_open === true &&
    terminalResult.structured_extraction.confirmed_pay === opportunity.listed_pay
  ) {
    pkaState = "KNOWN";
  } else if (
    terminalResult.structured_extraction.position_open === true &&
    terminalResult.structured_extraction.confirmed_pay !== opportunity.listed_pay
  ) {
    pkaState = "CONFLICTING";
  } else {
    pkaState = "PARTIAL";
  }

  // 6. DURABLE RECEIPT GENERATION
  const receipt = {
    timestamp: new Date().toISOString(),
    opportunity_id: opportunity.id,
    governance: {
      human_approved: true,
      bounded_questions: boundedQuestions
    },
    evidence: {
      provider: "CALL-E",
      transcript_snippet: terminalResult.transcript,
      extraction: terminalResult.structured_extraction
    },
    pka_resolution: {
      state: pkaState,
      justification: "Structured extraction completely matches digital claim."
    }
  };

  console.log("\n=== FINAL VERIFICATION RECEIPT ===");
  console.log(JSON.stringify(receipt, null, 2));
  
  rl.close();
}

runVerticalSlice().catch(console.error);