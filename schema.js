const mongoose = require("mongoose");

const example = new mongoose.Schema({
    example_text: String,
    evidence: [String],
    model_name: String,
    structure_followed: String,
    depth: String,
    factuality: String,
    attribution: String,
    revised_example: String,
    revised_evidence: String,
});

const task = new mongoose.Schema({
    completed: Boolean,
    task_id: String,
    field: String,
    specific_field: String,
    task_objective: String,
    task_procedure: String,
    task_input: [String],
    task_output: [String],
    task_notes: String,
    task_urls: String,
    annotator_id: String,
    examples: [example],
    time_spent: Number,
});

// modify the 3rd parameter to specify which MongoDB collection to use
module.exports = mongoose.model("tasks", task, "dolomites-stage2-1030");
