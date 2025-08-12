const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./jobs.db');

// jobs/job-runner.js
const registeredJobs = new Map();
const runningJobs = new Map();

function registerJob(name, JobClass) {
  registeredJobs.set(name, JobClass);
}

function startJob(name, params = {}) {
  const JobClass = registeredJobs.get(name);
  if (!JobClass) throw new Error(`Job "${name}" not registered`);

  const job = new JobClass(name, params);
  runningJobs.set(job.id, job);

  job.run(); // start execution

  job.on('done', () => job.status = 'done');
  job.on('error', () => job.status = 'error');

  return job;
}

function getRunningJobs() {
  return Array.from(runningJobs.values());
}

function getJob(id) {
  return runningJobs.get(id);
}

function getRegisteredJobs() {
  return Array.from(registeredJobs.keys());
}

function persistJob(job) {
  db.run(`
    INSERT INTO jobs (id, name, status, created, progress, params)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [job.id, job.name, job.status, job.created, job.progress || 0, JSON.stringify(job.params)]);
}

function updateJobStatus(job) {
  db.run(`UPDATE jobs SET status = ?, finished = ?, progress = ? WHERE id = ?`,
    [job.status, job.finished || null, job.progress || 0, job.id]);
}

function saveLogEntry(job, group, detail, message) {
  db.run(`
    INSERT INTO job_logs (job_id, timestamp, group_name, detail, message)
    VALUES (?, ?, ?, ?, ?)
  `, [job.id, Date.now(), group, detail, message]);
}

module.exports = { registerJob, startJob, getRunningJobs, getJob, getRegisteredJobs };
