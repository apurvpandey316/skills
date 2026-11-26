// Import the Express framework so that we can construct a router for tasks.
const express = require('express');
// Import the database connection that is used to read and write task records.
const databaseConnectionForTaskRecords = require('../db');

// Create the router that will contain all task-related route handlers.
const taskRoutesRouter = express.Router();

// This GET route lists all task records, ordering the newest records first.
taskRoutesRouter.get('/', (incomingRequest, outgoingResponse) => {
  // Query the database to obtain every task in descending creation order.
  const allTaskRecordsFromDatabase = databaseConnectionForTaskRecords.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
  // Send the retrieved task records to the client as a JSON response.
  outgoingResponse.json(allTaskRecordsFromDatabase);
});

// This POST route creates and returns a new task record.
taskRoutesRouter.post('/', (incomingRequest, outgoingResponse) => {
  // Retrieve the title property from the incoming request body.
  const { title: requestedTaskTitle } = incomingRequest.body;
  // Use the provided string title, or use an empty string if it is not a string.
  const normalizedTaskTitleValue = typeof requestedTaskTitle === 'string' ? requestedTaskTitle : '';
  // Insert the title into the database to create the new task record.
  const insertedTaskDatabaseInformation = databaseConnectionForTaskRecords.prepare('INSERT INTO tasks (title) VALUES (?)').run(normalizedTaskTitleValue);
  // Read back the newly inserted record using its generated identifier.
  const newlyCreatedTaskRecord = databaseConnectionForTaskRecords.prepare('SELECT * FROM tasks WHERE id = ?').get(insertedTaskDatabaseInformation.lastInsertRowid);
  // Respond with the created record and the HTTP created status.
  outgoingResponse.status(201).json(newlyCreatedTaskRecord);
});

// This PUT route toggles the completion state of the identified task.
taskRoutesRouter.put('/:id/toggle', (incomingRequest, outgoingResponse) => {
  // Read the task identifier from the URL parameters.
  const { id: requestedTaskIdentifier } = incomingRequest.params;
  // Look up the task record that corresponds to the identifier.
  const existingTaskRecord = databaseConnectionForTaskRecords.prepare('SELECT * FROM tasks WHERE id = ?').get(requestedTaskIdentifier);
  // Return an HTTP not-found response when the requested task is absent.
  if (!existingTaskRecord) return outgoingResponse.status(404).json({ error: 'Task not found' });
  // Mark the requested task as completed in the database.
  databaseConnectionForTaskRecords.prepare('UPDATE tasks SET completed = 1 WHERE id = ?').run(requestedTaskIdentifier);
  // Retrieve the updated record after the database update.
  const updatedTaskRecord = databaseConnectionForTaskRecords.prepare('SELECT * FROM tasks WHERE id = ?').get(requestedTaskIdentifier);
  // Return the updated task as JSON.
  outgoingResponse.json(updatedTaskRecord);
});

// This DELETE route removes the specified task record.
taskRoutesRouter.delete('/:id', (incomingRequest, outgoingResponse) => {
  // Obtain the identifier from the request parameters.
  const { id: requestedTaskIdentifier } = incomingRequest.params;
  // Ask the database to delete the matching task record.
  const deletionResultInformation = databaseConnectionForTaskRecords.prepare('DELETE FROM tasks WHERE id = ?').run(requestedTaskIdentifier);
  // Tell the caller if no matching record was found.
  if (deletionResultInformation.changes === 0) return outgoingResponse.status(404).json({ error: 'Task not found' });
  // Respond with no content to confirm the deletion.
  outgoingResponse.status(204).end();
});

// Export the router so that the server can mount it under the task API path.
module.exports = taskRoutesRouter;
