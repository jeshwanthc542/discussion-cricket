const express = require("express");
const app = express();
const path = require("path");
const dbPath = path.join(__dirname, "cricketMatchDetails.db");
const { open } = require("sqlite");
app.use(express.json());
const sqlite3 = require("sqlite3");
let db = null;

const initializeAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`server started`);
    });
  } catch (err) {
    console.log(`DB error ${err.message}`);
    process.exit(1);
  }
};

initializeAndServer();

//API GET DETAILS
app.get("/players/", async (request, response) => {
  const getQuery = `select * from player_details order by player_id;`;
  const result = await db.all(getQuery);
  response.send(result);
});

//API GET PLAYER DETAILS
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getQuery = `select * from player_details where player_id = ${playerId};`;
  const result = await db.get(getQuery);
  response.send(result);
});

//API UPDATE PLAYER DETAILS
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getBodyDetails = request.body;
  const { playerName } = getBodyDetails;
  const getQuery = `UPDATE player_details 
    SET 
    player_name = '${playerName}'
    WHERE player_id = ${playerId};`;
  await db.run(getQuery);
  response.send("Player Updated Successfully");
});
