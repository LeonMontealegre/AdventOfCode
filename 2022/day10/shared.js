
// Utility to get next instruction
function getNextIntruction(instructions) {
    // No more instructions
    if (instructions.length === 0)
        return ({ op: "exit", cycles: 1 });

    const [op, ...args] = instructions.popFirst();
    switch(op) {
        case "noop":
            return ({ op: "noop", cycles: 1 });
        case "addx":
            return ({ op: "addx", V: parseInt(args[0]), cycles: 2 });
        default:
            throw new Error(`Unknown op: ${op}`);
    }
}

// Function to run the CPU process
module.exports = function runProcess(instructions, processDuringCycle) {
    // Initialize process state
    let state = {
        x: 1,
        cycle: 0,
        curInstruction: getNextIntruction(instructions),
    };

    // Loop through
    while (true) {
        // Process cycle
        state["cycle"]++;
        processDuringCycle(state);

        // Check if current instruction is done
        const instruction = state["curInstruction"];
        if ((--instruction.cycles) === 0) {
            // Process instruction
            switch(instruction.op) {
                case "exit": return;
                case "noop": break;
                case "addx": state["x"] += instruction.V;
            }
            // Get next instruction
            state["curInstruction"] = getNextIntruction(instructions);
        }
    }
}
