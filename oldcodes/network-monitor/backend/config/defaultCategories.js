// backend/config/defaultCategories.js
const defaultCategories = [
    { name: "User Endpoint", notifyDownPolls: -1, notifyUpPolls: -1, pollInterval: 3600, lastPoll: new Date(), nextPoll: new Date() },
    { name: "Printer/MFP", notifyDownPolls: 10, notifyUpPolls: 10, pollInterval: 60, lastPoll: new Date(), nextPoll: new Date() },
    { name: "Cameras/Phones", notifyDownPolls: 10, notifyUpPolls: 10, pollInterval: 60, lastPoll: new Date(), nextPoll: new Date() },
    { name: "Infrastructure Device", notifyDownPolls: 4, notifyUpPolls: 4, pollInterval: 15, lastPoll: new Date(), nextPoll: new Date() },
    { name: "Servers", notifyDownPolls: 4, notifyUpPolls: 4, pollInterval: 15, lastPoll: new Date(), nextPoll: new Date() },
];

module.exports = defaultCategories;