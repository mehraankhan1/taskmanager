const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const { createTask } = require("../controllers/taskController"); // import properly

const { expect } = chai;

describe("Task Controller - createTask", () => {
  // Cleanup sinon stubs after each test
  afterEach(() => {
    sinon.restore();
  });

  it("should create a new task successfully", async () => {
    // Mock request
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: {
        title: "New Task",
        description: "Task description",
        deadline: "2025-12-31",
      },
    };

    // Mock expected created task
    const createdTask = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
      userId: req.user.id,
    };

    // Stub Task.create to return the fake task
    const createStub = sinon.stub(Task, "create").resolves(createdTask);

    // Mock response
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    // Call controller
    await createTask(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to
      .be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdTask)).to.be.true;
  });

  it("should return 500 if an error occurs", async () => {
    // Force Task.create to throw error
    sinon.stub(Task, "create").throws(new Error("DB Error"));

    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: {
        title: "Bad Task",
        description: "Failing test",
        deadline: "2025-12-31",
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    // Call controller
    await createTask(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;
  });
});
